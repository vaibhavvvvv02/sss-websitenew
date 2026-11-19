import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    Eye,
    Play,
    Pause,
    Clock,
    Lock,
    Zap,
    ChevronRight,
    AlertCircle,
    Copy,
    Settings,
    X,
    Activity,
    CheckCircle2,
    XCircle,
    ChevronDown
} from "lucide-react";
import api from "../../api/api";
import DensitySelector from "../../components/UI/DensitySelector";
import nicePrompt from "../../components/UI/NicePrompt";
import toast from "react-hot-toast";
import BasicReplies from "./BasicReplies";
import WhatsAppSimulator from "../../components/automation/WhatsAppSimulator";

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
                className="flex items-center justify-between w-full min-w-[140px] h-9 px-4 bg-white border border-slate-200 rounded-lg hover:border-[#128C7E] hover:bg-slate-50 transition-all text-sm font-medium text-slate-700 shadow-sm"
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


export default function FlowList() {
    const navigate = useNavigate();
    const location = useLocation();
    const [viewMode, setViewMode] = useState("advanced");
    const [flows, setFlows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
        const [statusFilter, setStatusFilter] = useState("all");
    const [previewFlowData, setPreviewFlowData] = useState(null);

    const handlePreview = async (flow) => {
        try {
            const res = await api.get(`/flows/${flow._id}`);
            const fullFlow = res.data.flow;
            setPreviewFlowData(fullFlow);
        } catch (err) {
            toast.error("Failed to load flow for preview");
        }
    };
    const [typeFilter, setTypeFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(() => {
        return Number(localStorage.getItem("flows_density")) || 10;
    });
    const [selectedFlowForLogs, setSelectedFlowForLogs] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    useEffect(() => {
        fetchFlows();
    }, [location.pathname]); // Refetch whenever returning to this page

    const fetchFlows = async () => {
        try {
            const res = await api.get("/flows");
            const fetchedFlows = res.data.flows || [];
            setFlows(fetchedFlows);
        } catch (err) {
            toast.error("Failed to load automation flows");
        } finally {
            setLoading(false);
        }
    };



    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "active" ? "paused" : "active";

        // Confirmation for pausing if active
        if (currentStatus === "active") {
            const confirmed = await nicePrompt.confirm(
                "Pause Automation",
                "Are you sure you want to pause this workflow? Active customers in this flow will stop receiving automated responses.",
                "warning"
            );
            if (!confirmed) return;
        }

        try {
            await api.patch(`/flows/${id}/status`, { status: newStatus });
            setFlows(flows.map(f => f._id === id ? { ...f, status: newStatus } : f));
            nicePrompt.success(
                newStatus === "active" ? "Workflow Active" : "Workflow Paused",
                `The flow has been successfully ${newStatus === "active" ? "activated" : "suspended"}.`
            );
        } catch (err) {
            const errorMsg = err.response?.data?.error || "The system was unable to synchronize the status change. Please try again.";
            nicePrompt.error("Status Update Failed", errorMsg);
        }
    };

    const handleDelete = async (id, status) => {
        const message = status === "active"
            ? "This flow is currently active. Deleting it will permanently stop all ongoing customer interactions. Proceed with deletion?"
            : "Are you sure you want to move this automation to the trash? This cannot be undone.";

        const confirmed = await nicePrompt.confirm(
            "Delete Workflow",
            message,
            "danger"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/flows/${id}`);
            setFlows(flows.filter(f => f._id !== id));
            nicePrompt.success("Workflow Deleted", "The automation flow has been permanently removed.");
        } catch (err) {
            nicePrompt.error("Delete Failed", err.response?.data?.error || "We couldn't process the deletion at this time.");
        }
    };

    const handleDuplicate = async (flow) => {
        try {
            const res = await api.get(`/flows/${flow._id}`);
            const fullFlow = res.data.flow;

            const payload = {
                name: `${fullFlow.name} (Copy)`,
                triggerType: fullFlow.triggerType,
                status: "draft",
                nodes: fullFlow.nodes,
                edges: fullFlow.edges
            };

            await api.post("/flows", payload);
            toast.success("Flow duplicated as draft");
            fetchFlows();
        } catch (err) {
            toast.error("Duplicate failed");
        }
    };

    const fetchLogs = async (flow) => {
        setSelectedFlowForLogs(flow);
        setLoadingLogs(true);
        setLogs([]);
        try {
            const res = await api.get(`/flows/${flow._id}/sessions`);
            setLogs(res.data.sessions || []);
        } catch (err) {
            toast.error("Failed to fetch execution logs");
        } finally {
            setLoadingLogs(false);
        }
    };


    const normalize = (str) => (str || "").toLowerCase().replace(/[\s_]/g, "");

    const filteredFlows = flows.filter(f => {
        if (f.isBasicReply) return false;
        const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || normalize(f.status) === normalize(statusFilter);
        const matchesType = typeFilter === "all" || normalize(f.triggerType) === normalize(typeFilter);

        return matchesSearch && matchesStatus && matchesType;
    });

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredFlows.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredFlows.length / rowsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "active": return "bg-[#E8F5F3] text-[#0c6b5e] border-[#128C7E]/20";
            case "paused": return "bg-amber-100 text-amber-700 border-amber-200";
            case "draft": return "bg-slate-100 text-slate-700 border-slate-200";
            default: return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#F0F7F4] font-poppins relative overflow-hidden">


            {viewMode === "basic" ? (
                <BasicReplies 
                    flows={flows} 
                    fetchFlows={fetchFlows} 
                    toggleStatus={toggleStatus} 
                    handleDelete={handleDelete}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />
            ) : (
                <div className="flex-1 overflow-hidden p-4 flex flex-col w-full">
                <div className="flex-1 min-h-0 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Unified Header */}
                    <div className="p-4 border-b border-slate-100 bg-white shrink-0">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center justify-between w-full">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto flex-1">
                                <div className="relative w-full lg:max-w-xs group flex-1 shrink-0">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#128C7E] transition-colors" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search automations..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-10 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#128C7E] focus:bg-white transition-all text-sm font-medium text-slate-700"
                                    />
                                </div>
                                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                                    <div className="w-full sm:w-auto">
                                        <FilterDropdown
                                            icon={Filter}
                                            value={statusFilter}
                                            onChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
                                            options={[
                                                { value: "all", label: "All Status" },
                                                { value: "active", label: "Active" },
                                                { value: "paused", label: "Paused" }
                                            ]}
                                        />
                                    </div>
                                    <div className="w-full sm:w-auto">
                                        <FilterDropdown
                                            icon={Zap}
                                            value={typeFilter}
                                            onChange={(val) => { setTypeFilter(val); setCurrentPage(1); }}
                                            options={[
                                                { value: "all", label: "All Types" },
                                                { value: "keyword", label: "Keyword / Text" },
                                                { value: "order_created", label: "Order Events" },
                                                { value: "contact", label: "New Contact" },
                                                { value: "campaign", label: "Campaign Response" },
                                                { value: "payment_success", label: "Payments" }
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto mt-1 lg:mt-0">
                                <div className="flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200/50 backdrop-blur-sm w-full sm:w-auto">
                                    <button
                                        onClick={() => setViewMode("advanced")}
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
                                        onClick={() => setViewMode("basic")}
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
                                    onClick={() => navigate("/automation/flows/new")}
                                    className="inline-flex justify-center sm:justify-start items-center gap-2 bg-[#128C7E] hover:bg-[#0c6b5e] text-white px-5 h-10 rounded-md font-bold text-sm transition-all shadow-sm active:scale-95 w-full sm:w-auto"
                                >
                                    <Plus size={18} strokeWidth={2.5} />
                                    Create Workflow
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto custom-scrollbar bg-white w-full animate-in fade-in duration-700">
                    {/* List View */}
                {loading ? (
                    <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-slate-50 rounded-[12px] animate-pulse" />
                        ))}
                    </div>
                ) : filteredFlows.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-[24px] border border-slate-200 border-dashed border-2">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                            <Zap className="text-slate-200" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No flows found</h3>
                        <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                            {searchQuery ? "Try adjusting your search terms." : "Create your first automated flow to get started."}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col divide-y divide-slate-100">
                        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-white text-[10px] font-black text-slate-500 uppercase tracking-widest sticky top-0 z-20 border-b border-slate-100 shadow-sm">
                            <div className="col-span-12 xl:col-span-3 pl-3">Workflow Details</div>
                            <div className="col-span-12 xl:col-span-2 hidden xl:block">Status</div>
                            <div className="col-span-12 xl:col-span-2 hidden xl:block">Trigger Event</div>
                            <div className="col-span-12 xl:col-span-2 hidden xl:block">Flow Size</div>
                            <div className="col-span-12 xl:col-span-1 hidden xl:block">Updated Date</div>
                            <div className="col-span-12 xl:col-span-2 text-right pr-3 hidden xl:block">Actions</div>
                        </div>
                        {filteredFlows.map((flow) => (
                            <div
                                key={flow._id}
                                className="group p-4 transition-all relative overflow-hidden even:bg-[#f1f5f9] odd:bg-transparent"
                            >

                                <div className="grid grid-cols-12 gap-3 items-center">
                                    <div className="col-span-12 xl:col-span-3 flex items-center gap-4 min-w-0">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${flow.status === 'active'
                                            ? 'bg-[#128C7E] text-white'
                                            : 'bg-slate-50 text-slate-400 border border-slate-100'
                                            }`}>
                                            <Zap size={18} strokeWidth={2.5} fill={flow.status === 'active' ? "currentColor" : "none"} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-[14px] font-bold text-slate-800 truncate tracking-tight">{flow.name}</h3>
                                                {flow.isLocked && (
                                                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded text-[8px] font-bold border border-rose-100 italic">
                                                        <Lock size={9} strokeWidth={3} /> LOCKED
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-span-12 xl:col-span-2 hidden xl:flex items-center">
                                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${getStatusColor(flow.status)}`}>
                                            {flow.status}
                                        </span>
                                    </div>

                                    <div className="col-span-12 xl:col-span-2 hidden xl:flex items-center">
                                        <span className="flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold tracking-wide">
                                            <div className={`w-1.5 h-1.5 rounded-full ${flow.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                            {flow.triggerType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                        </span>
                                    </div>
                                    
                                    <div className="col-span-12 xl:col-span-2 hidden xl:flex items-center">
                                        <span className="flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold">
                                            <Settings size={13} className="text-slate-400" />
                                            {flow.nodeCount || 0} Nodes
                                        </span>
                                    </div>

                                    <div className="col-span-12 xl:col-span-1 hidden xl:flex items-center">
                                        <span className="flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold">
                                            <Clock size={13} className="text-slate-400" />
                                            {new Date(flow.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>

                                    <div className="col-span-12 xl:col-span-2 flex items-center xl:justify-end gap-1.5 shrink-0 mt-3 xl:mt-0 overflow-x-auto custom-scrollbar-hide pb-1 xl:pb-0 snap-x">
                                        {flow.status !== "draft" && (
                                            <button
                                                onClick={() => toggleStatus(flow._id, flow.status)}
                                                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all border border-transparent shrink-0 snap-start
                                                    ${flow.status === 'active'
                                                        ? 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white'
                                                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                                                    }`}
                                                title={flow.status === 'active' ? 'Pause' : 'Activate'}
                                            >
                                                {flow.status === 'active' ? <Pause size={13} strokeWidth={3} /> : <Play size={13} strokeWidth={3} />}
                                            </button>
                                        )}
                                                                                <button
                                            onClick={() => handlePreview(flow)}
                                            className="w-8 h-8 bg-white border border-slate-200 text-slate-400 rounded-lg flex items-center justify-center hover:bg-[#E8F5F3] hover:text-[#128C7E] hover:border-[#128C7E]/20 transition-all shadow-sm shrink-0 snap-start"
                                            title="Preview Flow"
                                        >
                                            <Eye size={13} strokeWidth={2.5} />
                                        </button>
<button
                                            onClick={() => navigate(`/automation/flows/${flow._id}`)}
                                            className="w-8 h-8 bg-white border border-slate-200 text-slate-400 rounded-lg flex items-center justify-center hover:bg-[#E8F5F3] hover:text-[#128C7E] hover:border-[#128C7E]/20 transition-all shadow-sm shrink-0 snap-start"
                                            title="Open"
                                        >
                                            <Edit2 size={13} strokeWidth={2.5} />
                                        </button>
                                        <button
                                            onClick={() => fetchLogs(flow)}
                                            className="w-8 h-8 bg-white border border-slate-200 text-slate-400 rounded-lg flex items-center justify-center hover:bg-slate-50 hover:text-[#128C7E] transition-all shadow-sm shrink-0 snap-start"
                                            title="Execution History"
                                        >
                                            <Clock size={13} strokeWidth={2.5} />
                                        </button>
                                        <button
                                            onClick={() => handleDuplicate(flow)}
                                            className="w-8 h-8 bg-white border border-slate-200 text-slate-400 rounded-lg flex items-center justify-center hover:bg-slate-50 hover:text-[#128C7E] transition-all shadow-sm shrink-0 snap-start"
                                            title="Duplicate"
                                        >
                                            <Copy size={13} strokeWidth={2.5} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(flow._id, flow.status)}
                                            className="w-8 h-8 bg-white border border-slate-200 text-slate-400 rounded-lg flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all shrink-0 snap-start"
                                            title="Delete"
                                        >
                                            <Trash2 size={13} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                </div>
                {/* Footer - Consistency */}
                {!loading && filteredFlows.length > 0 && (
                    <div className="px-5 py-4 bg-white border-t border-slate-100 flex items-center shrink-0">
                        <div className="text-[12px] font-medium text-slate-500">
                            Total <span className="text-[#128C7E] font-black mx-1">{filteredFlows.length}</span> flows found
                        </div>
                    </div>
                )}
                </div>
            </div>
            )}

            {/* 📜 LOGS MODAL */}
            {selectedFlowForLogs && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setSelectedFlowForLogs(null)} />
                    <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#128C7E] rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h3 className="text-[16px] font-bold text-slate-800 leading-tight">Execution History</h3>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{selectedFlowForLogs.name}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedFlowForLogs(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Logs List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar min-h-[400px]">
                            {loadingLogs ? (
                                <div className="flex flex-col items-center justify-center h-full space-y-4 py-20">
                                    <div className="w-8 h-8 border-4 border-[#128C7E] border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Records...</p>
                                </div>
                            ) : logs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
                                        <Activity size={32} />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-800">No Activity Detected</h4>
                                    <p className="text-xs text-slate-400 mt-1">This flow hasn't been triggered by any customers yet.</p>
                                </div>
                            ) : (
                                logs.map((log) => (
                                    <div key={log._id} className="p-4 bg-slate-50 hover:bg-white border border-slate-100 hover:border-[#128C7E]/20 rounded-2xl transition-all flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2 h-2 rounded-full ${log.status === 'completed' ? 'bg-emerald-500' :
                                                    log.status === 'failed' ? 'bg-rose-500' :
                                                        'bg-[#128C7E] animate-pulse'
                                                }`} />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[13px] font-bold text-slate-800">
                                                        {(!log.contactName || log.contactName === 'New Customer' || log.contactName === 'Unknown')
                                                            ? log.contactPhone
                                                            : `${log.contactName} (${log.contactPhone})`}
                                                    </p>
                                                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${log.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                            log.status === 'failed' ? 'bg-rose-100 text-rose-700' :
                                                                'bg-[#E8F5F3] text-[#0c6b5e]'
                                                        }`}>
                                                        {log.status}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 flex items-center gap-2">
                                                    Last Step: <span className="text-slate-600">{log.currentNodeId === 'TRIGGER_FAILED' ? 'Trigger Failed (No Match)' : log.currentNodeId?.split('_').pop() || 'Start'}</span>
                                                    {log.lastInput && <span className="text-slate-400 italic font-medium lowercase">| input: "{log.lastInput}"</span>}
                                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                    {new Date(log.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(log.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Live execution monitor</p>
                        </div>
                    </div>
                </div>
            )}
            {/* ------------ Preview Modal ------------ */}
            {previewFlowData && (
                <WhatsAppSimulator
                    nodes={previewFlowData.nodes || []}
                    edges={previewFlowData.connections || previewFlowData.edges || []}
                    onClose={() => setPreviewFlowData(null)}
                />
            )}
        </div>
    );
}