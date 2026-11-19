import React, { useState, useEffect, useContext } from "react";
import { Plus, Search, CheckCircle2, ChevronDown, MessageSquare, Image as ImageIcon, Link2, MoreVertical, Edit2, Trash2, Zap, Clock, Play, Pause, X, Filter, UploadCloud, Activity } from "lucide-react";
import api from "../../api/api";
import toast from "react-hot-toast";
import { uploadFile } from "../../utils/uploadService";
import EmojiPicker from 'emoji-picker-react';
import { useIntegration } from "../../context/IntegrationContext";

// A custom dropdown similar to the one in FlowList
const FilterDropdown = ({ icon: Icon, value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = React.useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value) || options[0];

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full min-w-[160px] h-10 px-4 bg-white border border-slate-200 rounded-xl hover:border-[#128C7E] hover:bg-slate-50 transition-all text-[13px] font-semibold text-slate-700 shadow-sm"
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="text-slate-400" size={14} />}
                    <span>{selectedOption?.label}</span>
                </div>
                <ChevronDown className={`text-slate-400 transition-transform duration-200 w-4 h-4 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 min-w-full w-max mt-1.5 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 py-1.5 animate-in fade-in slide-in-from-top-2">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center justify-between gap-4 px-3 py-2 text-sm font-medium transition-colors ${
                                value === opt.value
                                    ? "bg-[#E8F5F3]/50 text-[#0c6b5e]"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                        >
                            <span className="whitespace-nowrap">{opt.label}</span>
                            {value === opt.value && <CheckCircle2 size={14} className="text-[#128C7E] shrink-0" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function BasicReplies({ flows, fetchFlows, toggleStatus, handleDelete, viewMode, setViewMode }) {
    const { facebookInstagramConnected } = useIntegration() || {};
    const [activePlatformTab, setActivePlatformTab] = useState("whatsapp");
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        trigger: "",
        matchCriteria: "keyword", // keyword, any
        instagramTriggerSource: "instagram_keyword", // instagram_keyword (both), instagram_message, instagram_comment
        responseType: "text",
        textResponse: "",
        mediaUrl: "",
        caption: ""
    });
    const [editingId, setEditingId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showVariables, setShowVariables] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [variableSearch, setVariableSearch] = useState("");
    const textRef = React.useRef(null);

    const variablesList = [
        { label: "First name", value: "{first_name}" },
        { label: "Last name", value: "{last_name}" },
        { label: "Full name", value: "{full_name}" },
        { label: "Email", value: "{email}" },
        { label: "Phone", value: "{phone}" },
        { label: "Group", value: "{group}" },
        { label: "Organization name", value: "{organization_name}" },
        { label: "Address", value: "{full_address}" },
        { label: "Street", value: "{street}" },
        { label: "City", value: "{city}" },
        { label: "State", value: "{state}" },
    ];

    const basicFlows = flows.filter(f => {
        if (!f.isBasicReply) return false;
        const p = f.platform || "whatsapp";
        return p === activePlatformTab;
    });

    const totalReplies = basicFlows.length;
    const totalKeywords = basicFlows.reduce((acc, flow) => {
        const keywords = flow.keywords?.length ? flow.keywords : (flow.nodes?.find(n => n.data?.type === 'trigger')?.data?.keywords || []);
        return acc + keywords.length;
    }, 0);
    const activeReplies = basicFlows.filter(f => f.status === 'active').length;
    const inactiveReplies = basicFlows.filter(f => f.status !== 'active').length;

    const filteredFlows = basicFlows.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (f.keywords && f.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())));
        // Type filter could be implemented if we accurately tag response types
        return matchesSearch;
    });

    const handleSaveReply = async () => {
        if (!formData.name.trim() || !formData.trigger.trim()) {
            toast.error("Please fill in required fields");
            return;
        }

        if (formData.responseType === "text" && !formData.textResponse.trim()) {
            toast.error("Please enter a text response");
            return;
        }
        if (formData.responseType !== "text" && !formData.mediaUrl) {
            toast.error("Please upload a file");
            return;
        }

        setIsSaving(true);
        try {
            const responseNode = formData.responseType === "text" ? {
                id: "node_response_1",
                type: "custom",
                position: { x: 250, y: 350 },
                data: {
                    type: "text",
                    label: "Text Response",
                    text: formData.textResponse,
                    buttons: []
                }
            } : {
                id: "node_response_1",
                type: "custom",
                position: { x: 250, y: 350 },
                data: {
                    type: "media",
                    label: "Media Response",
                    mediaType: formData.responseType,
                    imageUrl: formData.mediaUrl,
                    caption: formData.caption,
                    buttons: []
                }
            };

            const finalTriggerType = activePlatformTab === "instagram" ? formData.instagramTriggerSource : "keyword";

            const payload = {
                name: formData.name,
                triggerType: finalTriggerType,
                isBasicReply: true,
                platform: activePlatformTab,
                status: "active",
                nodes: [
                    {
                        id: "node_trigger_1",
                        type: "custom",
                        position: { x: 250, y: 150 },
                        data: { 
                            type: "trigger", 
                            label: "Keyword Trigger",
                            triggerType: finalTriggerType,
                            keywords: formData.trigger.split('\n').map(k => k.trim()).filter(Boolean),
                            matchType: formData.matchCriteria
                        }
                    },
                    responseNode
                ],
                connections: [
                    {
                        id: "edge_1",
                        source: "node_trigger_1",
                        target: "node_response_1",
                        sourceHandle: "bottom",
                        targetHandle: "top"
                    }
                ]
            };

            if (editingId) {
                await api.put(`/flows/${editingId}`, payload);
                toast.success("Instant Reply updated successfully!");
            } else {
                await api.post("/flows", payload);
                toast.success("Instant Reply created successfully!");
            }
            setIsModalOpen(false);
            setFormData({ name: "", trigger: "", matchCriteria: "keyword", instagramTriggerSource: "instagram_keyword", responseType: "text", textResponse: "", mediaUrl: "", caption: "" });
            setEditingId(null);
            await fetchFlows();
        } catch (error) {
            toast.error("Failed to save reply");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditReply = (flow) => {
        const triggerNode = flow.nodes?.find(n => n.data?.type === 'trigger');
        const responseNode = flow.nodes?.find(n => n.data?.type === 'text' || n.data?.type === 'media');
        
        setFormData({
            name: flow.name || "",
            trigger: triggerNode?.data?.keywords?.join('\n') || "",
            matchCriteria: triggerNode?.data?.matchType || "keyword",
            instagramTriggerSource: flow.triggerType || triggerNode?.data?.triggerType || "keyword",
            responseType: responseNode?.data?.type === "media" ? responseNode?.data?.mediaType : "text",
            textResponse: responseNode?.data?.text || "",
            mediaUrl: responseNode?.data?.imageUrl || "",
            caption: responseNode?.data?.caption || ""
        });
        setEditingId(flow._id);
        setIsModalOpen(true);
    };

    const onFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const url = await uploadFile(file);
            setFormData({ ...formData, mediaUrl: url });
            toast.success("File uploaded successfully");
        } catch (err) {
            toast.error("Failed to upload file");
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    const insertVariable = (variable) => {
        const input = textRef.current;
        if (input) {
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const newText = formData.textResponse.substring(0, start) + variable + formData.textResponse.substring(end);
            setFormData({...formData, textResponse: newText});
            setShowVariables(false);
            setVariableSearch("");
            setTimeout(() => {
                input.focus();
                input.setSelectionRange(start + variable.length, start + variable.length);
            }, 0);
        } else {
            setFormData({...formData, textResponse: formData.textResponse + variable});
            setShowVariables(false);
            setVariableSearch("");
        }
    };

    const insertFormatting = (syntax) => {
        const input = textRef.current;
        if (!input) return;
        
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const selectedText = formData.textResponse.substring(start, end);
        
        let newText;
        if (selectedText) {
            newText = formData.textResponse.substring(0, start) + syntax + selectedText + syntax + formData.textResponse.substring(end);
        } else {
            newText = formData.textResponse.substring(0, start) + syntax + syntax + formData.textResponse.substring(end);
        }
        
        setFormData({...formData, textResponse: newText});
        
        setTimeout(() => {
            input.focus();
            if (selectedText) {
                input.setSelectionRange(start + syntax.length, end + syntax.length);
            } else {
                input.setSelectionRange(start + syntax.length, start + syntax.length);
            }
        }, 0);
    };

    const insertEmoji = (emojiData) => {
        const input = textRef.current;
        const emoji = emojiData.emoji;
        if (input) {
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const newText = formData.textResponse.substring(0, start) + emoji + formData.textResponse.substring(end);
            setFormData({...formData, textResponse: newText});
            setTimeout(() => {
                input.focus();
                input.setSelectionRange(start + emoji.length, start + emoji.length);
            }, 0);
        } else {
            setFormData({...formData, textResponse: formData.textResponse + emoji});
        }
    };

    return (
        <div className="flex-1 overflow-hidden p-4 flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Main Content Area */}
            <div className="flex-1 min-h-0 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm relative overflow-hidden">
                
                {/* Filters & Actions */}
                <div className="p-4 border-b border-slate-100 bg-white shrink-0">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center justify-between w-full">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto flex-1">
                            <div className="relative w-full lg:max-w-sm group flex-1 shrink-0">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#128C7E] transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by name or trigger text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-800 focus:outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E] transition-all placeholder:text-slate-400 font-medium shadow-sm"
                                />
                            </div>

                            <div className="w-full sm:w-auto">
                                <FilterDropdown
                                    icon={null}
                                    value={typeFilter}
                                    onChange={setTypeFilter}
                                    options={[
                                        { value: "all", label: "All Response Types" },
                                        { value: "text", label: "Text Only" },
                                        { value: "image", label: "Image" },
                                        { value: "document", label: "Document" },
                                        { value: "video", label: "Video" },
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto mt-1 lg:mt-0">
                            <div className="flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200/50 backdrop-blur-sm w-full sm:w-auto">
                                <button
                                    onClick={() => setViewMode && setViewMode("advanced")}
                                    className={`relative flex-1 justify-center sm:flex-none px-2 sm:px-4 py-1.5 text-[10px] sm:text-[12px] font-bold rounded-lg transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${
                                        viewMode === "advanced" 
                                        ? "text-white shadow-sm" 
                                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                    }`}
                                >
                                    {viewMode === "advanced" && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#128C7E] to-[#0c6b5e] rounded-lg -z-10 shadow-[0_2px_10px_rgba(18,140,126,0.3)]" />
                                    )}
                                    <Activity size={14} className={viewMode === "advanced" ? "text-white" : "text-slate-400"} />
                                    <span className="truncate">Advanced Workflows</span>
                                </button>
                                <button
                                    onClick={() => setViewMode && setViewMode("basic")}
                                    className={`relative flex-1 justify-center sm:flex-none px-2 sm:px-4 py-1.5 text-[10px] sm:text-[12px] font-bold rounded-lg transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${
                                        viewMode === "basic" 
                                        ? "text-white shadow-sm" 
                                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                    }`}
                                >
                                    {viewMode === "basic" && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#128C7E] to-[#0c6b5e] rounded-lg -z-10 shadow-[0_2px_10px_rgba(18,140,126,0.3)]" />
                                    )}
                                    <Zap size={14} className={viewMode === "basic" ? "text-white" : "text-slate-400"} />
                                    <span className="truncate">Instant Replies</span>
                                </button>
                            </div>

                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex justify-center sm:justify-start items-center gap-2 bg-[#128C7E] hover:bg-[#0c6b5e] text-white px-5 h-10 rounded-xl font-bold text-[13px] transition-all shadow-sm active:scale-95 w-full sm:w-auto"
                            >
                                <Plus size={16} strokeWidth={3} />
                                Create Reply
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-5 space-y-5 flex flex-col">
                    {/* Metrics Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 shrink-0">
                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-[12px] md:rounded-[16px] p-3 md:p-5 relative overflow-hidden group">
                            <div className="flex items-center gap-1.5 md:gap-2 text-emerald-600 mb-2 md:mb-4">
                                <MessageSquare size={12} className="md:w-[14px] md:h-[14px]" />
                                <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider truncate">Total Replies</span>
                            </div>
                            <div className="text-xl md:text-2xl font-black text-slate-800">{totalReplies}</div>
                        </div>

                        <div className="bg-blue-50/50 border border-blue-100 rounded-[12px] md:rounded-[16px] p-3 md:p-5 relative overflow-hidden group">
                            <div className="flex items-center gap-1.5 md:gap-2 text-blue-600 mb-2 md:mb-4">
                                <Zap size={12} className="fill-blue-600/20 md:w-[14px] md:h-[14px]" />
                                <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider truncate">Total Keywords</span>
                            </div>
                            <div className="text-xl md:text-2xl font-black text-slate-800">{totalKeywords}</div>
                        </div>

                        <div className="bg-purple-50/50 border border-purple-100 rounded-[12px] md:rounded-[16px] p-3 md:p-5 relative overflow-hidden group">
                            <div className="flex items-center gap-1.5 md:gap-2 text-purple-600 mb-2 md:mb-4">
                                <CheckCircle2 size={12} className="fill-purple-600/20 md:w-[14px] md:h-[14px]" />
                                <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider truncate">Active Replies</span>
                            </div>
                            <div className="text-xl md:text-2xl font-black text-slate-800">{activeReplies}</div>
                        </div>

                        <div className="bg-amber-50/50 border border-amber-100 rounded-[12px] md:rounded-[16px] p-3 md:p-5 relative overflow-hidden group">
                            <div className="flex items-center gap-1.5 md:gap-2 text-amber-600 mb-2 md:mb-4">
                                <Pause size={12} className="md:w-[14px] md:h-[14px]" />
                                <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider truncate">Inactive Replies</span>
                            </div>
                            <div className="text-xl md:text-2xl font-black text-slate-800">{inactiveReplies}</div>
                        </div>
                    </div>

                    {facebookInstagramConnected && (
                        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl w-fit shrink-0">
                            <button
                                onClick={() => setActivePlatformTab("whatsapp")}
                                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                                    activePlatformTab === "whatsapp" 
                                    ? "bg-white text-[#128C7E] shadow-sm ring-1 ring-slate-200/50" 
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                }`}
                            >
                                WhatsApp
                            </button>
                            <button
                                onClick={() => setActivePlatformTab("instagram")}
                                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                                    activePlatformTab === "instagram" 
                                    ? "bg-white text-purple-600 shadow-sm ring-1 ring-slate-200/50" 
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                }`}
                            >
                                Instagram
                            </button>
                        </div>
                    )}

                    {/* Table View */}
                    <div className="flex-1 overflow-x-auto border border-slate-200/60 rounded-xl min-h-[300px]">
                        <table className="w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-sm shadow-sm ring-1 ring-slate-200/20">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200/60">Name</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200/60">Trigger Text</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200/60">Match Criteria</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200/60">Response Type</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200/60">Last Updated</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200/60">Status</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200/60">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredFlows.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-2 py-12 text-center text-slate-400 text-[12px] font-medium">
                                            Showing 0 to 0 of 0 replies
                                        </td>
                                    </tr>
                                ) : (
                                    filteredFlows.map(flow => {
                                        const triggerNode = flow.nodes?.find(n => n.data?.type === 'trigger');
                                        const matchType = triggerNode?.data?.matchType === 'contains' ? 'Contains' : 'Exact match';
                                        const keywords = flow.keywords?.join(', ') || triggerNode?.data?.keywords?.join(', ') || '-';
                                        
                                        // Determine response type simply by checking first action node
                                        const actionNode = flow.nodes?.find(n => n.data?.type !== 'trigger');
                                        const responseType = actionNode?.data?.type === 'text' ? 'Text' : 'Media / Link';

                                        return (
                                            <tr key={flow._id} className="cursor-pointer group hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-bold text-slate-800 font-poppins">{flow.name}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-medium text-slate-600">
                                                        {keywords}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center justify-center h-6 leading-none text-[10px] font-bold bg-[#E8F5F3] text-[#128C7E] px-2.5 rounded-md uppercase tracking-widest border border-[#128C7E]/20">{matchType}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                                                        {responseType}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider font-poppins">
                                                        <Clock className="w-3 h-3 text-slate-400" />
                                                        {new Date(flow.updatedAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer"
                                                            checked={flow.status === 'active'}
                                                            onChange={() => toggleStatus(flow._id, flow.status)}
                                                        />
                                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#128C7E]"></div>
                                                    </label>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => handleEditReply(flow)}
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-[#128C7E]/10 hover:text-[#128C7E] transition-all shadow-sm"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(flow._id, flow.status)}
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white w-full max-w-4xl rounded-[24px] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                            <div className="flex items-start sm:items-center gap-3">
                                <button onClick={() => { setIsModalOpen(false); setEditingId(null); setFormData({ name: "", trigger: "", matchCriteria: "exact", responseType: "text", textResponse: "" })}} className="w-8 h-8 shrink-0 mt-0.5 sm:mt-0 border border-slate-200 hover:bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 transition-colors">
                                    &lt;
                                </button>
                                <div className="ml-1 sm:ml-2">
                                    <h3 className="text-[16px] sm:text-[18px] font-bold text-slate-800 leading-tight">{editingId ? "Edit instant reply" : "Create instant reply"}</h3>
                                    <p className="text-[11px] sm:text-[12px] text-slate-500 font-medium flex items-start sm:items-center gap-1.5 mt-1 sm:mt-0">
                                        <span className="w-3 h-3 shrink-0 rounded-full border border-slate-300 flex items-center justify-center text-[8px] mt-0.5 sm:mt-0">i</span>
                                        <span className="leading-tight">Set up a simple automated reply for your contacts</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                                <button
                                    onClick={() => { setIsModalOpen(false); setEditingId(null); setFormData({ name: "", trigger: "", matchCriteria: "exact", responseType: "text", textResponse: "" })}}
                                    className="flex-1 sm:flex-none px-5 py-2.5 sm:py-2 text-[13px] font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors border border-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveReply}
                                    disabled={isSaving}
                                    className="flex-1 sm:flex-none px-6 py-2.5 sm:py-2 bg-[#128C7E] text-white text-[13px] font-bold rounded-xl hover:bg-[#0c6b5e] hover:shadow-lg hover:shadow-[#128C7E]/20 transition-all disabled:opacity-50"
                                >
                                    {isSaving ? 'Saving...' : 'Save reply'}
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <div className="max-w-4xl mx-auto space-y-6">
                                
                                {/* Name Input */}
                                <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4 items-center">
                                    <div>
                                        <label className="text-[14px] font-bold text-slate-800 block">Name</label>
                                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Give your reply a name</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 bg-slate-100 p-1 rounded-md text-[10px]">
                                            Tag
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Enter reply name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full h-11 pl-12 pr-4 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-800 focus:outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E] transition-all font-medium placeholder:text-slate-400 placeholder:font-normal shadow-sm"
                                        />
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Trigger Input (Hidden if 'any' match criteria is selected) */}
                                {formData.matchCriteria !== "any" && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4 items-start">
                                            <div>
                                                <label className="text-[14px] font-bold text-slate-800 block mt-2">Trigger</label>
                                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Add the string of text responsible for triggering the response</p>
                                            </div>
                                            <div className="relative">
                                                <Zap className="absolute left-4 top-4 text-slate-400" size={14} />
                                                <textarea
                                                    placeholder="Enter trigger text"
                                                    value={formData.trigger}
                                                    onChange={(e) => setFormData({...formData, trigger: e.target.value})}
                                                    className="w-full h-24 pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-800 focus:outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E] transition-all font-medium placeholder:text-slate-400 placeholder:font-normal resize-none shadow-sm"
                                                />
                                                <div className="text-right text-[10px] font-medium text-slate-400 mt-1">{formData.trigger.length}/200</div>
                                            </div>
                                        </div>

                                        <hr className="border-slate-100" />
                                    </>
                                )}

                                {/* Match Criteria */}
                                <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4 items-center">
                                    <div>
                                        <label className="text-[14px] font-bold text-slate-800 block">Match Criteria</label>
                                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Select the criteria for matching the trigger text above</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Filter size={14} />
                                        </div>
                                        <select
                                            value={formData.matchCriteria}
                                            onChange={(e) => setFormData({...formData, matchCriteria: e.target.value})}
                                            className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-800 focus:outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E] transition-all font-medium shadow-sm appearance-none pl-10"
                                        >
                                            <option value="keyword">Reply to specific keywords</option>
                                            <option value="any">Reply to any message</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Trigger Source (Instagram/Facebook only) */}
                                {(activePlatformTab === "instagram" || activePlatformTab === "facebook") && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4 items-center">
                                            <div>
                                                <label className="text-[14px] font-bold text-slate-800 block">Trigger Source</label>
                                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Select where this reply should trigger</p>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                    <MessageSquare size={14} />
                                                </div>
                                                <select
                                                    value={formData.instagramTriggerSource}
                                                    onChange={(e) => setFormData({...formData, instagramTriggerSource: e.target.value})}
                                                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-800 focus:outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E] transition-all font-medium shadow-sm appearance-none pl-10"
                                                >
                                                    <option value="instagram_keyword">Direct Messages & Comments</option>
                                                    <option value="instagram_message">Direct Messages Only</option>
                                                    <option value="instagram_comment">Comments Only</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                            </div>
                                        </div>

                                        <hr className="border-slate-100" />
                                    </>
                                )}

                                {/* Response Type */}
                                <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4 items-center">
                                    <div>
                                        <label className="text-[14px] font-bold text-slate-800 block">Response Type</label>
                                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Choose how the bot should respond</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <MessageSquare size={14} />
                                        </div>
                                        <select
                                            value={formData.responseType}
                                            onChange={(e) => setFormData({...formData, responseType: e.target.value})}
                                            className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-800 focus:outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E] transition-all font-medium shadow-sm appearance-none pl-10"
                                        >
                                            <option value="text">Respond with text</option>
                                            <option value="image">Respond with image</option>
                                            <option value="document">Respond with document</option>
                                            <option value="video">Respond with video</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {formData.responseType === "text" ? (
                                    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4 items-start">
                                        <div>
                                            <label className="text-[14px] font-bold text-slate-800 block mt-2">Text Response</label>
                                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Enter the message to send as reply</p>
                                        </div>
                                        <div className="relative border border-slate-200 rounded-xl focus-within:border-[#128C7E] focus-within:ring-1 focus-within:ring-[#128C7E] shadow-sm transition-all bg-white">
                                            <textarea
                                                ref={textRef}
                                                placeholder="Enter your reply message"
                                                value={formData.textResponse}
                                                onChange={(e) => setFormData({...formData, textResponse: e.target.value})}
                                                className="w-full h-32 p-4 text-[13px] text-slate-800 focus:outline-none font-medium placeholder:text-slate-400 placeholder:font-normal resize-none rounded-t-xl bg-transparent"
                                            />
                                            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between relative rounded-b-xl">
                                                <button type="button" onClick={() => setShowVariables(true)} className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-[#128C7E] transition-colors">
                                                    Add Variable <ChevronDown size={12} />
                                                </button>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1.5 text-slate-400">
                                                        <button type="button" onClick={() => insertFormatting('*')} className="w-5 h-5 flex items-center justify-center hover:text-slate-600 font-serif font-bold text-xs">B</button>
                                                        <button type="button" onClick={() => insertFormatting('_')} className="w-5 h-5 flex items-center justify-center hover:text-slate-600 font-serif italic text-xs">I</button>
                                                        <button type="button" onClick={() => insertFormatting('~')} className="w-5 h-5 flex items-center justify-center hover:text-slate-600 font-mono text-xs line-through">S</button>
                                                        <button type="button" onClick={() => insertFormatting('```')} className="w-5 h-5 flex items-center justify-center hover:text-slate-600 font-mono text-[10px]">&lt;/&gt;</button>
                                                        <div className="relative">
                                                            <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="w-5 h-5 flex items-center justify-center hover:text-slate-600 text-xs">😀</button>
                                                            {showEmojiPicker && (
                                                                <div className="absolute bottom-full right-0 mb-2 z-[100] shadow-2xl">
                                                                    <div className="fixed inset-0 z-[90]" onClick={() => setShowEmojiPicker(false)} />
                                                                    <div className="relative z-[100]">
                                                                        <EmojiPicker onEmojiClick={insertEmoji} width={300} height={400} />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] font-medium text-slate-400">{formData.textResponse.length}/1000</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4 items-start">
                                            <div>
                                                <label className="text-[14px] font-bold text-slate-800 block mt-2 capitalize">{formData.responseType} Response</label>
                                            </div>
                                            <div>
                                                <label className="w-full h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#128C7E] hover:bg-[#F0F7F4]/50 transition-all">
                                                    <input type="file" className="hidden" onChange={onFileUpload} accept={formData.responseType === "image" ? "image/*" : formData.responseType === "video" ? "video/*" : ".pdf,.doc,.docx"} />
                                                    {isUploading ? (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="w-6 h-6 border-2 border-[#128C7E] border-t-transparent rounded-full animate-spin" />
                                                            <span className="text-[12px] font-bold text-slate-500">Uploading...</span>
                                                        </div>
                                                    ) : formData.mediaUrl ? (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <CheckCircle2 className="text-[#128C7E]" size={24} />
                                                            <span className="text-[12px] font-bold text-slate-800">File Uploaded</span>
                                                            <span className="text-[10px] text-slate-400">Click to replace</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <UploadCloud className="text-slate-400" size={24} />
                                                            <span className="text-[13px] font-bold text-[#128C7E]">Upload a file</span>
                                                            <span className="text-[10px] text-slate-400">Up to 16MB</span>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4 items-center">
                                            <div>
                                                <label className="text-[14px] font-bold text-slate-800 block mt-2">Caption <span className="text-slate-400 font-normal">(Optional)</span></label>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Add a caption for your media..."
                                                value={formData.caption || ""}
                                                onChange={(e) => setFormData({...formData, caption: e.target.value})}
                                                className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-800 focus:outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E] transition-all font-medium placeholder:text-slate-400 placeholder:font-normal shadow-sm"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="flex items-center gap-2 bg-[#E8F5F3]/50 p-3 rounded-xl border border-[#128C7E]/20 text-[#0c6b5e]">
                                    <div className="w-5 h-5 rounded-full border border-[#0c6b5e] flex items-center justify-center text-[10px] font-bold">i</div>
                                    <span className="text-[12px] font-medium">Tip: Keep replies clear, concise and relevant to the trigger for better engagement.</span>
                                </div>

                            </div>
                        </div>

                        {/* Variables Modal Overlay */}
                        {showVariables && (
                            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowVariables(false)} />
                                <div className="bg-white w-full max-w-lg rounded-[20px] shadow-2xl relative flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
                                    <div className="p-6 pb-4">
                                        <h3 className="text-[18px] font-bold text-slate-800 mb-4">Select a Variable</h3>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Search variables..."
                                                value={variableSearch}
                                                onChange={(e) => setVariableSearch(e.target.value)}
                                                autoFocus
                                                className="w-full h-11 px-4 bg-white border border-[#128C7E]/40 rounded-xl text-[13px] text-slate-800 focus:outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E] transition-all font-medium placeholder:text-slate-400 placeholder:font-normal shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-2">
                                        <div className="space-y-1">
                                            {variablesList
                                                .filter(v => v.label.toLowerCase().includes(variableSearch.toLowerCase()) || v.value.toLowerCase().includes(variableSearch.toLowerCase()))
                                                .map((v) => (
                                                <button
                                                    key={v.value}
                                                    onClick={() => insertVariable(v.value)}
                                                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors group"
                                                >
                                                    <span className="text-[13px] font-medium text-slate-700">{v.label}</span>
                                                    <span className="text-[12px] font-mono text-slate-400 group-hover:text-slate-600 transition-colors">{v.value}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-[20px]">
                                        <button
                                            onClick={() => setShowVariables(false)}
                                            className="w-full py-3 bg-[#5455E4] text-white text-[14px] font-bold rounded-xl hover:bg-[#4344b5] transition-all shadow-sm"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}
