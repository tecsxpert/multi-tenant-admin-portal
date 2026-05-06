import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getTenants, searchTenants } from '../services/api';
import CustomDropdown from '../components/CustomDropdown';
import SparkleLoader from '../components/SparkleLoader';

const TenantList = () => {
    const navigate = useNavigate();
    const [tenants, setTenants] = useState([]);
    const [initialLoad, setInitialLoad] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
        { value: 'SUSPENDED', label: 'Suspended' },
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchTenants();
    }, [page, debouncedSearch, statusFilter]);

    const fetchTenants = async () => {
        try {
            setTableLoading(true);

            const response = debouncedSearch
                ? await searchTenants(debouncedSearch, page, 5)
                : await getTenants(page, 5);

            let data = response.data.content;
            
            if (statusFilter) {
                data = data.filter(t => t.status === statusFilter);
            } else {
                data = data.filter(t => t.status !== 'DELETED');
            }
            
            setTenants(data);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            const mockData = [
                { id: 1, name: 'Acme Corp', description: 'Primary Operational Node', status: 'ACTIVE', createdAt: new Date() },
                { id: 2, name: 'Global Tech', description: 'Enterprise Gateway', status: 'INACTIVE', createdAt: new Date() }
            ];
            setTenants(mockData);
            setTotalPages(1);
        } finally {
            setInitialLoad(false);
            setTableLoading(false);
        }
    };

    // Full-page loader only on first visit
    if (initialLoad) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <SparkleLoader text="Synchronizing Node Registry..." />
        </div>
    );

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-l-8 border-brand pl-8 py-4 bg-white/5 rounded-r-3xl">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-white uppercase">Registry</h1>
                    <p className="text-sm font-semibold text-white/40 mt-1">Authorized node management layer</p>
                </div>
                <div className="flex space-x-4 mr-4">
                    <button onClick={() => {}} className="bg-white/5 text-xs font-bold px-6 py-3 rounded-xl border border-white/10 hover:bg-brand hover:text-black transition-all">
                        Export Records
                    </button>
                    <Link to="/new" className="bg-brand text-black text-xs font-bold px-8 py-3 rounded-xl hover:bg-black hover:text-brand transition-all border-2 border-brand">
                        Create New Node
                    </Link>
                </div>
            </div>

            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <input
                        type="text"
                        placeholder="Search by ID or Organization name..."
                        className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand transition-all font-medium text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="w-64">
                        <CustomDropdown 
                            options={statusOptions} 
                            value={statusFilter} 
                            onChange={setStatusFilter} 
                            placeholder="Filter Status"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-black/10 dark:border-white/10">
                                <th className="py-6 text-xs font-bold text-black/40 dark:text-white/30 uppercase tracking-widest">Identification</th>
                                <th className="py-6 text-xs font-bold text-black/40 dark:text-white/30 uppercase tracking-widest">Protocol</th>
                                <th className="py-6 text-xs font-bold text-black/40 dark:text-white/30 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 dark:divide-white/5">

                            {/* INLINE TABLE LOADER */}
                            {tableLoading && (
                                <tr>
                                    <td colSpan="3" className="py-16">
                                        <div className="flex justify-center">
                                            <SparkleLoader text="Scanning Registry..." />
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* NO RESULTS */}
                            {!tableLoading && tenants.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="py-16 text-center">
                                        <p className="text-2xl font-black text-white/20 mb-2">No Nodes Found</p>
                                        <p className="text-sm font-medium text-white/40">
                                            Node with name "<span className="text-[#078446] font-bold">{debouncedSearch}</span>" does not exist
                                        </p>
                                    </td>
                                </tr>
                            )}

                            {/* NODE ROWS */}
                            {!tableLoading && tenants.map((tenant) => (
                                <tr 
                                    key={tenant.id} 
                                    onClick={() => navigate(`/tenant/${tenant.id}`)}
                                    className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer"
                                >
                                    <td className="py-8 px-4">
                                        <div className="text-xl font-bold dark:text-white group-hover:text-brand transition-colors">
                                            {tenant.name}
                                        </div>
                                        <p className="text-xs font-medium text-black/50 dark:text-white/30 mt-1">{tenant.description}</p>
                                    </td>
                                    <td className="py-8">
                                        <span className={`text-[10px] font-black px-4 py-2 rounded-lg border-2 ${tenant.status === 'ACTIVE' ? 'bg-brand text-black border-brand' : 'border-black/10 dark:border-white/10 dark:text-white'}`}>
                                            {tenant.status}
                                        </span>
                                    </td>
                                    <td className="py-8 text-right px-4">
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <Link to={`/edit/${tenant.id}`} className="text-[10px] font-bold text-black/40 dark:text-white/40 hover:text-brand underline underline-offset-4 uppercase tracking-widest">Configure</Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-between items-center pt-8 border-t border-black/5 dark:border-white/5 mt-8">
                        <span className="text-xs font-bold text-black/40 dark:text-white/30 tracking-widest">Page {page + 1} of {totalPages}</span>
                        <div className="flex space-x-4">
                            <button onClick={() => setPage(page - 1)} disabled={page === 0} className="px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 text-xs font-bold disabled:opacity-20 hover:bg-brand hover:text-black transition-all">Previous</button>
                            <button onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1} className="px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 text-xs font-bold disabled:opacity-20 hover:bg-brand hover:text-black transition-all">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TenantList;
