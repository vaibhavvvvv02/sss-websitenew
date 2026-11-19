// src/pages/automation/FlowBuilder.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import CustomSelect from "../../components/UI/CustomSelect";
import FlowSelect from "../../components/UI/FlowSelect";
import { useParams, useNavigate } from "react-router-dom";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  NodeToolbar,
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
} from 'reactflow';
import 'reactflow/dist/style.css';
import WhatsAppSimulator from '../../components/automation/WhatsAppSimulator';
import CustomNode from '../../components/automation/CustomNode';
import CustomEdge from '../../components/automation/CustomEdge';
import { FiEye, FiPlay, FiMessageSquare, FiImage, FiClock, FiGitBranch, FiSettings, FiPlus, FiEdit, FiCopy, FiTrash2, FiX, FiArrowLeft, FiCheck, FiChevronRight, FiMove, FiZap, FiTarget, FiGrid, FiAlertTriangle, FiCreditCard, FiLink, FiMaximize, FiPhone, FiExternalLink, FiLayers , FiList, FiShoppingCart, FiUser, FiHelpCircle, FiDatabase, FiMousePointer } from "react-icons/fi";
import dagre from 'dagre';
import api from "../../api/api";
import nicePrompt from "../../components/UI/NicePrompt";
import { useIntegration } from "../../context/IntegrationContext";
import { useAuth } from "../../context/useAuth";

const API_BASE = import.meta.env.VITE_SERVER_URL;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, ranksep: 150, nodesep: 100 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 350, height: 250 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';
    
    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - 350 / 2,
      y: nodeWithPosition.y - 250 / 2,
    };
  });

  return { nodes, edges };
};


// Node Types - Streamlined for a perfect professional experience
const NODE_TYPES = [
  { type: 'trigger', label: 'Flow Start', icon: FiPlay, color: 'emerald', category: 'Actions' },
  { type: 'text', label: 'Text + Buttons', icon: FiMessageSquare, color: 'blue', category: 'Message types' },
  { type: 'media', label: 'Media Input', icon: FiImage, color: 'blue', category: 'Message types' },
  { type: 'template', label: 'Template', icon: FiCheck, color: 'indigo', category: 'Message types' },
  { type: 'system_template', label: 'System Template', icon: FiMessageSquare, color: 'sky', category: 'Message types' },
  { type: 'delay', label: 'Delay', icon: FiClock, color: 'amber', category: 'Actions' },
  { type: 'intervention', label: 'Human Agent', icon: FiSettings, color: 'slate', category: 'Actions' },
  { type: 'user_input', label: 'User Input', icon: FiTarget, color: 'violet', category: 'Actions' },
  { type: 'interactive_list', label: 'Interactive Menu', icon: FiGrid, color: 'purple', category: 'Message types' },
  { type: 'payment', label: 'Payment Node', icon: FiCreditCard, color: 'indigo', category: 'Actions' },
  { type: 'whatsapp_flow', label: 'WhatsApp Form', icon: FiLayers, color: 'blue', category: 'Message types' },
  { type: 'ai', label: 'AI Node', icon: FiMessageSquare, color: 'violet', category: 'Actions' },
];

// Safe render helper to catch object rendering issues
const safeRender = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return value.toString();
  if (typeof value === 'object') {
    return value.text || value.value || value.label || value.type || fallback;
  }
  return fallback;
};

// Helper to replace variables in template preview with premium rendering
const replaceVariables = (text, variables) => {
  if (!text) return '';
  if (!variables) return text;

  const parts = text.split(/(\{\{\d+\}\})/g);
  return parts.map((part, i) => {
    const match = part.match(/\{\{(\d+)\}\}/);
    if (match) {
      const num = match[1];
      const val = variables[num] || part;

      let display = val;
      let isSystem = true;
      if (val === '{{customer_name}}') display = '[Name]';
      else if (val === '{{customer_phone}}') display = '[Phone]';
      else if (val === '{{order_id}}') display = '[Order ID]';
      else if (val === '{{amount}}') display = '[Total]';
      else if (val === '{{tracking_link}}') display = '[Track]';
      else if (val === '{{checkout_url}}') display = '[Checkout]';
      else if (val === '{{invoice_url}}') display = '[Invoice]';
      else isSystem = false;

      if (isSystem) {
        return <span key={i} className="text-teal-600 font-bold px-1.5 py-0.5 bg-teal-50/50 rounded-lg border border-teal-100 mx-0.5 text-[11px] inline-flex items-center">{display}</span>;
      }
      return <span key={i} className="text-emerald-600 font-bold px-1.5 py-0.5 bg-emerald-50 rounded-md border border-emerald-100 mx-0.5 text-[11px]">{val}</span>;
    }
    return part;
  });
};

const SYSTEM_VARIABLES = [
  { label: 'Recipient Name', value: '{{customer_name}}' },
  { label: 'Recipient Phone', value: '{{customer_phone}}' },
  { label: 'Order ID / Number', value: '{{order_id}}' },
  { label: 'Order Total', value: '{{amount}}' },
  { label: 'Tracking Link', value: '{{tracking_link}}' },
  { label: 'Checkout URL', value: '{{checkout_url}}' },
  { label: 'Invoice URL', value: '{{invoice_url}}' },
  { label: 'Order Items (List)', value: '{{order_items}}' },
  { label: 'Order Date', value: '{{order_date}}' },
];

const reactFlowNodeTypes = {
  custom: CustomNode,
  text: CustomNode,
  trigger: CustomNode,
  template: CustomNode,
  delay: CustomNode,
  condition: CustomNode,
  action: CustomNode,
  media: CustomNode,
  list: CustomNode,
  single_product: CustomNode,
  multi_product: CustomNode,
  intervention: CustomNode,
  user_input: CustomNode,
  api: CustomNode,
  tag: CustomNode,
  system_template: CustomNode,
  ai: CustomNode,
  payment: CustomNode,
  whatsapp_flow: CustomNode,
  interactive_list: CustomNode,
};

const reactFlowEdgeTypes = {
  custom: CustomEdge,
};

function FlowBuilder({ isWooCommerceMode = false, isWhatsAppStoreMode = false }) {
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const { user } = useAuth();
  const { flowId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const { whatsappCommerceConnected, wooConnected, shopifyConnected, facebookInstagramConnected } = useIntegration();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [systemTemplates, setSystemTemplates] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [triggerOptions, setTriggerOptions] = useState([]);
  const [savedFlow, setSavedFlow] = useState(null);
  const [formBuilders, setFormBuilders] = useState([]);
  const [paymentGateways, setPaymentGateways] = useState({ razorpay: false, upi: false, offline: false });

  // Keyword Modal State
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [newKeywordInput, setNewKeywordInput] = useState("");
  
  const [keywordConflicts, setKeywordConflicts] = useState([]); // Array of { keyword, flowName }
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [headerOverrideTab, setHeaderOverrideTab] = useState('url'); // 'url' | 'upload'
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pasteContent, setPasteContent] = useState('');
  const connectingNodeId = useRef(null);
  const connectingHandleId = useRef(null);
  const [edgeDropMenu, setEdgeDropMenu] = useState(null);

  const onConnectStart = useCallback((_, { nodeId, handleId }) => {
    connectingNodeId.current = nodeId;
    connectingHandleId.current = handleId;
  }, []);

  const onConnectEnd = useCallback((event) => {
    let isHandle = false;
    if (event.target && typeof event.target.closest === 'function') {
      isHandle = event.target.closest('.react-flow__handle');
    }
    
    if (!isHandle && connectingNodeId.current) {
      if (typeof window !== 'undefined' && window.nicePrompt) {
         window.nicePrompt.success("Quick Add", "Select a block to connect!");
      }
      const clientX = event.clientX ?? (event.changedTouches ? event.changedTouches[0].clientX : 0);
      const clientY = event.clientY ?? (event.changedTouches ? event.changedTouches[0].clientY : 0);
      
      // Clamp coordinates to ensure popup is always visible
      const safeX = Math.min(clientX, window.innerWidth - 280);
      const safeY = Math.min(clientY, window.innerHeight - 400);

      setEdgeDropMenu({
        x: safeX,
        y: safeY,
        rawX: clientX, // Used for accurate node projection
        rawY: clientY,
        sourceNodeId: connectingNodeId.current,
        sourceHandleId: connectingHandleId.current,
      });
    }
    
    // Clear after a tiny delay to not interfere with other events
    setTimeout(() => {
      connectingNodeId.current = null;
      connectingHandleId.current = null;
    }, 50);
  }, []);

  const handleQuickAdd = (type) => {
    if (!edgeDropMenu) return;
    let projectedPos;
    if (screenToFlowPosition) {
      projectedPos = screenToFlowPosition({ x: edgeDropMenu.rawX || edgeDropMenu.x, y: edgeDropMenu.rawY || edgeDropMenu.y });
    } else {
      const bounds = document.querySelector('.react-flow').getBoundingClientRect();
      projectedPos = project({ x: (edgeDropMenu.rawX || edgeDropMenu.x) - bounds.left, y: (edgeDropMenu.rawY || edgeDropMenu.y) - bounds.top });
    }
    
    const newNodeId = addNode(type, projectedPos);
    if (newNodeId) {
      setEdges(eds => eds.concat({
         id: `e-${edgeDropMenu.sourceNodeId}-${edgeDropMenu.sourceHandleId}-${newNodeId}`,
         source: edgeDropMenu.sourceNodeId,
         sourceHandle: edgeDropMenu.sourceHandleId || 'default',
         target: newNodeId,
         targetHandle: 'target',
         type: 'custom',
         style: { stroke: '#94a3b8', strokeWidth: 2 }
      }));
    }
    setEdgeDropMenu(null);
  };

  // Auto-open right panel when a node is selected
  useEffect(() => {
    if (selectedNode) {
      setIsRightPanelOpen(true);
    }
  }, [selectedNode?.id]);
  useEffect(() => {
    const isEdit = flowId && flowId !== 'new';
    console.log('🔧 FlowBuilder initialized:', {
      mode: isEdit ? 'EDIT' : 'CREATE',
      flowId,
      savedFlowName: savedFlow?.name || 'not loaded'
    });
  }, [flowId, savedFlow?.name]);

  // ✅ Initial load of necessary data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Fetch Templates
        const tRes = await api.get('/templates');
        if (tRes.data.success) setTemplates(tRes.data.templates || []);

        // Fetch System Templates
        const stRes = await api.get('/system-templates');
        setSystemTemplates(stRes.data || []);

        // Fetch Campaigns
        const cRes = await api.get('/campaigns');
        if (cRes.data.success) setCampaigns(cRes.data.campaigns || []);

        // Fetch Trigger Options
        const trRes = await api.get('/flows/triggers');
        if (trRes.data.success) setTriggerOptions(trRes.data.triggers || []);

        // Fetch WhatsApp Flows
        try {
          const flowRes = await api.get('/form-builder');
          if (flowRes.data.success) {
            const fetchedFlows = flowRes.data.data || flowRes.data.flows || [];
            setFormBuilders(fetchedFlows.filter(f => f.status === 'PUBLISHED' || f.status === 'APPROVED'));
          }
        } catch (flowErr) {
          console.error("Failed to load WhatsApp flows:", flowErr);
        }

        // Fetch Payment Gateway integrations
        try {
          const pgRes = await api.get('/payment-integration');
          if (pgRes.data.success && pgRes.data.settings) {
            const s = pgRes.data.settings;
            setPaymentGateways({
              razorpay: !!(s.razorpay?.enabled && s.razorpay?.has_keyId),
              upi: !!(s.upi?.enabled && s.upi?.has_upiId),
              offline: !!(s.offline?.enabled),
            });
          }
        } catch (pgErr) {
          console.error("Failed to load payment gateways:", pgErr);
        }
      } catch (err) {
        console.error("Initial load failed:", err);
      }
    };
    loadInitialData();
  }, []);

  // Load flow data
  useEffect(() => {
    if (flowId && flowId !== 'new') {
      loadFlow();
    }
  }, [flowId]);

  const loadFlow = async () => {
    if (!flowId || flowId === 'new') return;
    try {
      console.log(`📥 Loading flow with ID: ${flowId}`);
      const res = await api.get(`/flows/${flowId}`);
      const flow = res.data.flow;

      console.log('✅ Flow loaded:', {
        flowId: flow?._id,
        name: flow?.name,
        nodeCount: flow?.nodes?.length || 0,
        edgeCount: flow?.connections?.length || 0
      });

      if (flow?.nodes) {
        setNodes(flow.nodes.map(node => ({
          ...node,
          type: 'custom',
          data: { ...node.data, type: node.data?.type || node.type }
        })));
      }
      if (flow?.connections) {
        setEdges(flow.connections);
      }
      setSavedFlow(flow);
    } catch (err) {
      console.error("❌ Failed to load flow", err);
    }
  };

  const loadTemplates = async () => {
    try {
      // ✅ PRIORITY 1: Load from Local DB for instant selection
      const res = await api.get('/templates');
      const localTemplates = res.data.templates || [];
      setTemplates(localTemplates);

      // ✅ PRIORITY 2: Background sync with Meta to update statuses/fetch new
      // We don't block the UI for this, it just updates the list if successful
      api.get('/templates/sync/meta').then(syncRes => {
        if (syncRes.data.success && syncRes.data.templates) {
          setTemplates(syncRes.data.templates);
        }
      }).catch(err => console.log("Background sync failed (Silent):", err));

    } catch (err) {
      console.error("Failed to load templates", err);
    }

    try {
      // ✅ PRIORITY 3: Load WhatsApp Flows
      const flowRes = await api.get('/form-builder');
      if (flowRes.data.success) {
        const fetchedFlows = flowRes.data.data || flowRes.data.flows || [];
        setFormBuilders(fetchedFlows.filter(f => f.status === 'PUBLISHED' || f.status === 'APPROVED'));
      }
    } catch (err) {
      console.error("Failed to load WhatsApp flows:", err);
    }
  };

  const handleMediaUpload = async (file) => {
    if (!selectedNode || (selectedNode.data.type !== 'media' && selectedNode.data.type !== 'template' && selectedNode.data.type !== 'payment')) return;
    try {
      setIsUploadingMedia(true);
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        if (selectedNode.data.type === 'template') {
          updateNode(selectedNode.id, { headerImageUrl: res.data.url });
        } else if (selectedNode.data.type === 'payment') {
          updateNode(selectedNode.id, { qrCodeUrl: res.data.url });
        } else {
          updateNode(selectedNode.id, {
            imageUrl: res.data.url,
            mediaType: file.type.startsWith('image/') ? 'image' : (file.type.includes('video') ? 'video' : 'document')
          });
        }
        nicePrompt.success("Upload Success", "Your media has been processed successfully.");
      }
    } catch (err) {
      console.error("Upload failed", err);
      nicePrompt.error("Upload Failed", "Please check your internet connection or try a different file.");
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const generateCommerceTemplate = useCallback(() => {
    const commerceNodes = [
      // STEP 1: TRIGGER
      { id: 'node_start', type: 'custom', position: { x: 500, y: 0 }, data: { type: 'trigger', triggerType: 'order_created', label: 'Flow Start' } },

      // STEP 2: ORDER RECEIVED
      {
        id: 'node_received', type: 'custom', position: { x: 500, y: 250 }, data: {
          type: 'text',
          text: "🧾 *Order Received!*\n\nHi {{customer_name}},\nWe've received your order #{{order_id}} for ₹{{amount}}.\n\nPlease complete the payment to process your order."
        }
      },

      // STEP 3: PAYMENT NODE
      {
        id: 'node_payment', type: 'custom', position: { x: 500, y: 550 }, data: {
          type: 'payment',
          paymentType: 'link',
          bodyText: "💳 *Complete your Payment*",
          paymentLink: "{{checkout_url}}",
          footerText: "Safe & Secure Payment"
        }
      },

      // STEP 4: SUCCESS MESSAGE
      {
        id: 'node_success', type: 'custom', position: { x: 500, y: 850 }, data: {
          type: 'text',
          text: "✅ *Payment Received!*\n\nThank you for your payment. Your order is now being processed. We will notify you once it's shipped."
        }
      }
    ];

    const commerceEdges = [
      { id: 'e1', source: 'node_start', target: 'node_received', markerEnd: { type: 'arrowclosed' } },
      { id: 'e2', source: 'node_received', target: 'node_payment', markerEnd: { type: 'arrowclosed' } },
      { id: 'e3', source: 'node_payment', target: 'node_success', markerEnd: { type: 'arrowclosed' } }
    ];

    setNodes(commerceNodes);
    setEdges(commerceEdges);
    nicePrompt.success("Manual Payment Flow Applied", "A streamlined payment-focused order flow has been generated.");
  }, [setNodes, setEdges]);




  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      id: `edge_${Date.now()}`,
      type: 'custom',
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setIsRightPanelOpen(true);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  /**
   * 🔍 Real-time Keyword Collision Check for Selected Node
   */
  const checkConflicts = useCallback(async (keywordsToCheck) => {
    if (!keywordsToCheck || keywordsToCheck.length === 0) {
      setKeywordConflicts([]);
      return;
    }
    try {
      const res = await api.post('/flows/validate-keywords', {
        keywords: keywordsToCheck,
        excludeFlowId: flowId === 'new' || !flowId ? null : flowId
      });
      if (res.data.success) {
        setKeywordConflicts(res.data.conflicts || []);
      }
    } catch (err) {
      console.error("Collision check failed", err);
    }
  }, [flowId]);

  // Sync conflicts whenever keywords change in the active node
  useEffect(() => {
    if (!selectedNode) {
      setKeywordConflicts([]);
      return;
    }

    // Find keywords based on node type
    const node = nodes.find(n => n.id === selectedNode.id);
    if (!node) return;

    let keywordsToValidate = [];
    if (node.data?.type === 'trigger') {
      keywordsToValidate = node.data.keywords || [];
    } else if (node.data?.type === 'user_input') {
      keywordsToValidate = (node.data.keywordRoutes || [])
        .map(r => r.keyword)
        .filter(Boolean)
        .flatMap(k => k.split(",").map(s => s.trim()));
    }

    if (keywordsToValidate.length > 0) {
      const debounce = setTimeout(() => {
        checkConflicts(keywordsToValidate);
      }, 500);
      return () => clearTimeout(debounce);
    } else {
      setKeywordConflicts([]);
    }
  }, [selectedNode, nodes, checkConflicts]);

  const { project, getViewport, screenToFlowPosition } = useReactFlow();

  const addNode = (nodeType, position = null) => {
    // 🛡️ Calculate center of current view for better UX
    const { x, y, zoom } = getViewport();
    const center = project({
      x: (window.innerWidth / 2) - 160, // Center minus half node width
      y: (window.innerHeight / 2) - 100,
    });

    const newNode = {
      id: `node_${Date.now()}`,
      type: 'custom',
      position: position || center,
      data: {
        type: nodeType,
        label: NODE_TYPES.find(n => n.type === nodeType)?.label,
        // Default data based on type
        ...(nodeType === 'trigger' && { triggerType: 'Message Received', keywords: [] }),
        ...(nodeType === 'text' && { text: '', buttons: [] }),
        ...(nodeType === 'template' && { templateName: '', templatePreview: null }),
        ...(nodeType === 'delay' && { waitAmount: 5, waitUnit: 'Minutes' }),
        ...(nodeType === 'condition' && { condition: '', options: ['Yes', 'No'] }),
        ...(nodeType === 'single_product' && { productTitle: '', price: '', currency: '₹', imageUrl: '', description: '' }),
        ...(nodeType === 'multi_product' && { products: [], currency: '₹' }),
        ...(nodeType === 'interactive_list' && { text: 'Please select an option...', buttonText: 'View Menu', sections: [{ title: 'Menu', rows: [{ id: `opt-${Date.now()}`, title: 'Option 1', description: '' }] }] }),
        ...(nodeType === 'action' && { action: '' }),
        ...(nodeType === 'user_input' && { variableName: 'user_reply', routingMode: 'free', keywordRoutes: [] }),
        ...(nodeType === 'whatsapp_flow' && { flowId: '', buttonText: 'Open Form', messageBody: 'Please fill out this form:', flowName: '' }),
        ...(nodeType === 'intervention' && { handoverMessage: '' }),
        ...(nodeType === 'payment' && { displayMessage: 'Click below to pay securely', discountType: 'flat', discountValue: '', linkExpiry: '15', footerMessage: 'Safe & Secure Transaction' }),
        ...(nodeType === 'ai' && { systemPrompt: '', userPrompt: '', outputVariable: 'ai_response' }),
        ...(nodeType === 'api' && { url: '', method: 'GET', headers: '', payload: '' }),
        ...(nodeType === 'tag' && { tagName: '', actionType: 'add' }),
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setSelectedNode(newNode);
    setIsRightPanelOpen(true);
    return newNode.id;
  };

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  const duplicateNode = useCallback((nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      const newNode = {
        ...node,
        id: `node_${Date.now()}`,
        selected: true,
        position: {
          x: node.position.x + 350,
          y: node.position.y + 100,
        },
      };

      // Deselect all others first to prevent simultaneous movement
      setNodes((nds) => nds.map(n => ({ ...n, selected: false })).concat(newNode));

      // ✅ Auto-select the duplicate for a better UX
      setSelectedNode(newNode);
      setIsRightPanelOpen(true);
    }
  }, [nodes, setNodes]);

  const updateNode = useCallback((nodeId, updates) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
    );
  }, [setNodes]);

  const addNextNode = useCallback((sourceNodeId) => {
    const sourceNode = nodes.find(n => n.id === sourceNodeId);
    if (sourceNode) {
      const newNodeId = `node_${Date.now()}`;
      const newNode = {
        id: newNodeId,
        type: 'custom',
        position: {
          x: sourceNode.position.x,
          y: sourceNode.position.y + 150,
        },
        data: {
          type: 'text',
          label: 'Text Message',
          text: '',
          buttons: [],
        },
      };

      const newEdge = {
        id: `edge_${Date.now()}`,
        source: sourceNodeId,
        target: newNodeId,
        type: 'smoothstep',
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#6b7280',
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) => eds.concat(newEdge));
      setSelectedNode(newNode);
    }
  }, [nodes, setNodes, setEdges]);

  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      'LR'
    );

    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);

    // Auto-fit view after layout to show everything clearly
    setTimeout(() => {
      onPaneClick(); // Clear selection
    }, 100);
  }, [nodes, edges, setNodes, setEdges]);

  const saveFlow = async () => {
    try {
      // --- Pre-Save Validation Engine ---
      if (nodes.length > 1 && edges.length === 0) {
        alert("Validation Error: Please connect your flow steps before saving.");
        return;
      }

      for (const node of nodes) {
        const type = node.data?.type;
        if (type === 'text' && !node.data.text?.trim()) {
          nicePrompt.error("Missing Content", `Your message block (${node.id}) is empty. Please provide the message text before saving.`);
          return;
        }
        if (type === 'media' && !node.data.imageUrl) {
          nicePrompt.error("Media Required", `Your media block (${node.id}) needs a file or URL to be attached.`);
          return;
        }
        if (type === 'template' && !node.data.templateName) {
          nicePrompt.error("Select Template", `Please choose a template for the block (${node.id}) before continuing.`);
          return;
        }
      }
      // --- End Validation ---

      // Determine if this is an edit or create
      const isEdit = flowId && flowId !== 'new';

      // Get flow name from custom high-end prompt
      const flowName = await nicePrompt.ask(
        "Workflow Name",
        "Give your automation a recognizable name to keep things organized.",
        "e.g. Abandoned Cart Recovery",
        isEdit ? savedFlow?.name || "Updated Flow" : `Flow ${Date.now()}`
      );

      if (!flowName) return; // User cancelled

      // Clean node data by removing React functions and circular references
      const cleanNodes = nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          ...node.data,
          // Explicitly ensure critical fields are present
          type: node.data?.type,
          triggerType: node.data?.triggerType,
          keywords: node.data?.keywords || [],
          text: node.data?.text || node.data?.message,
          imageUrl: node.data?.imageUrl || node.data?.url,
          buttons: node.data?.buttons || [],
          options: node.data?.options || [],
          // Remove potential function references that break JSON.stringify
          onEdit: undefined,
          onDelete: undefined,
          onDuplicate: undefined
        }
      }));

      // Extract root-level metadata from nodes (e.g. trigger type)
      const triggerNode = nodes.find(n => n.data?.type === 'trigger');

      const flowData = {
        name: flowName,
        nodes: cleanNodes,
        connections: edges, // Convert edges to connections for backend compatibility
        triggerType: triggerNode?.data?.triggerType || "Message Received",
        cooldownHours: triggerNode?.data?.cooldownHours ? parseInt(triggerNode.data.cooldownHours, 10) : 0,
        status: savedFlow?.status || "paused",
        platform: isWooCommerceMode ? 'woocommerce' : (isWhatsAppStoreMode ? 'whatsapp_store' : 'whatsapp')
      };

      console.log('Saving flow data:', {
        isEdit,
        flowId,
        flowName,
        nodeCount: cleanNodes.length,
        edgeCount: edges.length
      });

      let saveResponse;

      if (isEdit) {
        // ✅ EDIT: Update existing flow with PUT
        if (!flowId) {
          throw new Error("Flow ID is missing. Cannot update flow.");
        }
        console.log(`Updating flow: ${flowId} with name: ${flowName}`);
        saveResponse = await api.put(`/flows/${flowId}`, flowData);

        // Update local status with response
        if (saveResponse.data.success && saveResponse.data.flow) {
          setSavedFlow(saveResponse.data.flow);
          nicePrompt.success("Workflow Updated", `"${flowName}" has been saved successfully.`);

          // Optionally, we can stay on the page for edits
          // navigate(`/automation/flows/${flowId}`, { replace: true });
        }
      } else {
        // ✅ CREATE: New flow with POST
        console.log(`Creating new flow with name: ${flowName}`);
        saveResponse = await api.post("/flows", flowData);

        if (saveResponse.data.success && saveResponse.data.flow) {
          nicePrompt.success("Workflow Created", `"${flowName}" is ready to be activated.`);
          // Redirect to the EDIT page of the new flow so subsequent saves work as UPDATES
          const newFlowId = saveResponse.data.flow._id;
          navigate(isWhatsAppStoreMode ? `/commerce/flows/${newFlowId}` : (isWooCommerceMode ? `/woocommerce/flows/${newFlowId}` : `/automation/flows/${newFlowId}`), { replace: true });
          return;
        }
      }

      // If we are still here (for edits), just stay and update the local state if needed
      if (saveResponse.data?.flow) {
        setSavedFlow(saveResponse.data.flow);
      }
    } catch (err) {
      console.error("Save failed:", err);
      console.error("Error response:", err.response?.data);
      nicePrompt.error(
        "Save Failed",
        err.response?.data?.error || err.message || "An error occurred while saving your flow."
      );
    }
  };


  // Handle node actions
  const handleNodeAction = useCallback((action, nodeId, event) => {
    event.stopPropagation();

    switch (action) {
      case 'edit':
        setSelectedNode(nodes.find(n => n.id === nodeId));
        setIsRightPanelOpen(true);
        break;
      case 'duplicate':
        duplicateNode(nodeId);
        break;
      case 'delete':
        deleteNode(nodeId);
        break;
      case 'addNext':
        addNextNode(nodeId);
        break;
    }
  }, [nodes, duplicateNode, deleteNode, addNextNode, setSelectedNode]);

  const disconnectNode = useCallback((nodeId) => {
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    nicePrompt.success("Disconnected", "All connections for this step have been removed.");
  }, [setEdges]);

  // Derived state for the currently selected node to ensure real-time updates while typing
  const activeNode = selectedNode ? nodes.find(n => n.id === selectedNode.id) : null;

  return (
    <div className="absolute inset-0 flex flex-col bg-[#F0F7F4] font-[Poppins]">
      {/* Floating Canvas Header */}
      <div className="m-4 mb-0 bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl px-5 py-3 flex items-center justify-between flex-shrink-0 z-30 shadow-sm relative">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(isWhatsAppStoreMode ? '/commerce/flows' : (isWooCommerceMode ? '/woocommerce/flows' : '/automation/flows'))}
            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <FiArrowLeft size={18} strokeWidth={2.5} />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-[19px] font-bold text-slate-800 tracking-tight">
                {savedFlow?.name || (flowId && flowId !== 'new' ? 'Loading...' : (isWhatsAppStoreMode ? 'New WhatsApp Store Flow' : (isWooCommerceMode ? 'New WooCommerce Flow' : 'New Flow')))}
              </h1>
              <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-[#128C7E] bg-gradient-to-r from-[#E8F5F3] to-[#dcfce7] border border-[#128C7E]/20 rounded-md uppercase tracking-widest shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#128C7E] animate-pulse" />
                {flowId && flowId !== 'new' ? 'EDIT MODE' : 'DRAFT'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wider mt-0.5 uppercase flex items-center gap-2">
              <span>Flow Builder Canvas</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-[#128C7E]">{nodes.length} Nodes</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {savedFlow && (
            <button
              onClick={async () => {
                const newStatus = savedFlow.status === 'active' ? 'paused' : 'active';
                try {
                  const res = await api.patch(`/flows/${flowId}/status`, { status: newStatus });
                  if (res.data.success) {
                    setSavedFlow({ ...savedFlow, status: newStatus });
                    if (newStatus === 'active') {
                      nicePrompt.success("Flow Activated", "Your automation is now live and waiting for triggers.");
                    } else {
                      nicePrompt.info("Flow Paused", "Automation suspended. Users will no longer trigger this flow.");
                    }
                  }
                } catch (err) {
                  nicePrompt.error("Status Update Failed", "Could not change flow status. Please try again.");
                }
              }}
              className={`px-5 h-10 text-[12px] font-bold rounded-xl border transition-all duration-300 flex items-center gap-2 shadow-sm ${savedFlow.status === 'active'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
            >
              <div className={`w-2 h-2 rounded-full ${savedFlow.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              {savedFlow.status === 'active' ? 'ACTIVE' : 'PAUSED'}
            </button>
          )}

          <div className="w-px h-6 bg-slate-200" />

          <button
            onClick={onLayout}
            className="px-5 h-10 text-[12px] font-bold text-slate-600 hover:text-[#128C7E] bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-all flex items-center gap-2 shadow-sm active:scale-95"
          >
            <FiGrid size={15} strokeWidth={2.5} className="opacity-70" />
            Organize Flow
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="px-5 h-10 text-[12px] font-bold text-[#128C7E] hover:bg-[#128C7E] hover:text-white bg-white rounded-xl border border-[#128C7E] transition-all flex items-center gap-2 shadow-sm active:scale-95"
          >
            <FiEye size={15} strokeWidth={2.5} />
            Preview Flow
          </button>
          <button
            onClick={saveFlow}
            className="relative overflow-hidden px-6 h-10 bg-[#128C7E] text-white rounded-xl text-[12px] font-bold transition-all flex items-center gap-2 active:scale-95 group shadow-[0_2px_10px_rgba(18,140,126,0.2)] hover:shadow-[0_4px_15px_rgba(18,140,126,0.3)] border border-[#0c6b5e]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <FiCheck size={16} strokeWidth={3} />
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative p-4 pt-1 gap-6">

        {/* Left Panel - Content Block */}
        <div className="w-[340px] bg-white border border-slate-200 flex flex-col z-20 overflow-hidden rounded-[24px] shadow-sm animate-in slide-in-from-left duration-700">
          <div className="p-6 border-b border-slate-100 bg-white">
            <h3 className="text-[16px] font-semibold text-slate-800 flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-[#128C7E] rounded-full" />
              Content Block
            </h3>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide mt-1.5">Drag and drop to build</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {['Message types', 'Actions'].map((category) => (
              <div key={category} className="mb-6 last:mb-0">
                <h4 className="text-[16px] font-normal text-[#455A64] mb-3">{category}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {NODE_TYPES.filter(n => n.category === category).map((nodeType) => {
                    const IconComponent = nodeType.icon;
                    return (
                      <button
                        key={nodeType.type}
                        onClick={() => addNode(nodeType.type)}
                        className="h-[84px] flex flex-col items-center justify-center p-2 rounded-[8px] bg-white border border-slate-200 hover:border-[#128C7E] transition-all group active:scale-[0.98] shadow-none"
                      >
                        <div className="text-[#128C7E] mb-2 transition-transform duration-300 group-hover:scale-110">
                          <IconComponent size={24} strokeWidth={1.5} />
                        </div>
                        <span className="text-[12px] font-medium text-[#128C7E] text-center leading-tight px-1">
                          {nodeType.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 relative bg-white border border-slate-200 rounded-[32px] overflow-hidden animate-in fade-in duration-1000">
          <ReactFlow
            minZoom={0.05}
            maxZoom={2.5}
            nodes={nodes.map(node => ({
              ...node,
              data: {
                ...node.data,
                updateData: (updates) => updateNode(node.id, updates),
                onEdit: (e) => handleNodeAction('edit', node.id, e),
                onDuplicate: (e) => handleNodeAction('duplicate', node.id, e),
                onDelete: (e) => handleNodeAction('delete', node.id, e),
                onDisconnect: (e) => disconnectNode(node.id),
                onAddNext: (e) => handleNodeAction('addNext', node.id, e),
              }
            }))}
            edges={edges.map(edge => {
              const isSelectedNodeConnected = selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id);
              const isActive = edge.selected || isSelectedNodeConnected;

              return {
                ...edge,
                type: 'custom', // Custom Edge with delete button
                style: {
                  stroke: isActive ? '#3b82f6' : '#94a3b8',
                  strokeWidth: isActive ? 2 : 2,
                  transition: 'all 0.3s ease',
                  opacity: isActive || !selectedNode ? 1 : 0.4,
                  filter: isActive ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))' : 'none',
                },
                animated: false,
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  width: 20,
                  height: 20,
                  color: isActive ? '#3b82f6' : '#CBD5E1',
                },
              };
            })}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={reactFlowNodeTypes}
            edgeTypes={reactFlowEdgeTypes}
            
            fitView
            attributionPosition="bottom-left"
            connectionLineStyle={{
              stroke: '#94a3b8',
              strokeWidth: 2,
              strokeDasharray: '6,6'
            }}
            defaultEdgeOptions={{
              type: 'custom',
            }}
          >
            <Background variant="dots" color="#94a3b8" gap={24} size={1.5} />
            <Controls className="!bg-white !border-slate-200 ! !rounded-2xl !p-1.5" />
            <MiniMap
              nodeColor={() => '#3b82f6'}
              style={{ borderRadius: '20px', border: '1px solid #e2e8f0', background: 'white' }}
              maskColor="rgba(244, 247, 254, 0.6)"
              strokeColor="#3b82f6"
            />
          </ReactFlow>
        </div>

      {edgeDropMenu && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setEdgeDropMenu(null)} />
          <div 
            className="fixed z-[9999] bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden w-64 animate-in fade-in zoom-in-95 duration-200"
            style={{ top: edgeDropMenu.y, left: edgeDropMenu.x }}
          >
            <div className="bg-white px-4 py-3 flex justify-between items-center border-b border-slate-100">
              <span className="text-[14px] font-semibold text-slate-800">Content Block</span>
              <button onClick={() => setEdgeDropMenu(null)} className="text-slate-600 hover:text-slate-900 transition-colors"><FiX size={18} strokeWidth={2.5} /></button>
            </div>
            <div className="p-2 grid grid-cols-1 gap-0 max-h-[350px] overflow-y-auto custom-scrollbar bg-white">
              {[
                { type: 'text', label: 'Text + Button', icon: FiMessageSquare },
                { type: 'media', label: 'Media', icon: FiImage },
                { type: 'template', label: 'Template', icon: FiCheck },
                { type: 'system_template', label: 'System Template', icon: FiMessageSquare },
                { type: 'interactive_list', label: 'Interactive Menu', icon: FiGrid },
                { type: 'whatsapp_flow', label: 'WhatsApp Form', icon: FiLayers },
                { type: 'user_input', label: 'User Input', icon: FiTarget }
              ].map(nt => (
                <button 
                  key={nt.type}
                  onClick={() => handleQuickAdd(nt.type)}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg text-left group transition-colors"
                >
                  <div className="p-1.5 text-[#128C7E] bg-[#E8F5F3] rounded-md">
                    <nt.icon size={16} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-slate-800">{nt.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {showPreview && (
        <WhatsAppSimulator
          nodes={nodes}
          edges={edges}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* ================= BULK PASTE MODAL ================= */}
      {showPasteModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowPasteModal(false)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-[#128C7E] text-white">
              <div>
                <h3 className="text-xl font-bold">Auto-fill Body Variables</h3>
                <p className="text-xs font-medium text-white/80 mt-1 uppercase tracking-widest">Paste multi-line content to map</p>
              </div>
              <button onClick={() => setShowPasteModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                <FiX size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Paste Content Here</label>
                <textarea
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  className="w-full h-[200px] bg-slate-50 border-none rounded-[24px] p-6 text-[14px] font-medium text-slate-700 focus:ring-4 focus:ring-[#128C7E]/10 outline-none resize-none transition-all"
                  placeholder="Line 1 -> {{1}}&#10;Line 2 -> {{2}}&#10;Line 3 -> {{3}}"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    const lines = pasteContent.split('\n').filter(l => l.trim());
                    const variables = { ...(activeNode.data.variables || {}) };
                    lines.forEach((line, idx) => {
                      variables[(idx + 1).toString()] = line.trim();
                    });
                    updateNode(activeNode.id, { variables });
                    setShowPasteModal(false);
                    setPasteContent('');
                    nicePrompt.success("Variables Mapped", `${lines.length} variables have been auto-filled.`);
                  }}
                  className="flex-1 h-14 bg-[#128C7E] hover:bg-[#0c6b5e] text-white font-bold rounded-[20px]/20 transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-[13px]"
                >
                  <FiCheck size={18} /> Map Variables
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

const FlowBuilderWrapper = ({ isWooCommerceMode = false, isWhatsAppStoreMode = false }) => (
  <div className="w-full h-full relative">
    <ReactFlowProvider>
      <FlowBuilder isWooCommerceMode={isWooCommerceMode} isWhatsAppStoreMode={isWhatsAppStoreMode} />
    </ReactFlowProvider>
  </div>
);

export default FlowBuilderWrapper;
