import React from 'react';

/**
 * ActivityItem — Single row in the Operation Feed.
 * @param {Object} log - The AuditLog entity from backend
 */
const ActivityItem = ({ log }) => {
    // Format the date to a readable string
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Map backend action keys to human-readable labels
    const actionLabels = {
        'NODE_PROVISIONED': 'Node Provisioned',
        'NODE_OPTIMIZED': 'Node Optimized',
        'ISOLATION_PROTOCOL': 'Isolation Protocol'
    };

    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl group cursor-pointer hover:bg-brand transition-all">
            <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full transition-colors ${
                    log.action === 'ISOLATION_PROTOCOL' ? 'bg-red-500' : 'bg-brand'
                } group-hover:bg-black`} />
                <div>
                    <p className="text-sm font-semibold dark:text-white group-hover:text-black transition-colors">
                        {actionLabels[log.action] || log.action}
                    </p>
                    <p className="text-[10px] font-bold text-black/40 dark:text-white/30 group-hover:text-black/60 uppercase tracking-widest">
                        Index: {log.entityId}
                    </p>
                </div>
            </div>
            <span className="text-[10px] font-bold text-black/30 dark:text-white/20 group-hover:text-black/60">
                {formatTime(log.createdAt)}
            </span>
        </div>
    );
};

export default ActivityItem;
