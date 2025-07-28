import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { 
    IoArrowUp, 
    IoArrowDown, 
    IoTrendingUp, 
    IoCheckmarkCircle, 
    IoPulse, 
    IoTime, 
    IoBusiness, 
    IoRefresh, 
    IoCloseCircle 
} from 'react-icons/io5';
import { downloadDocument } from '../../../utils/download';

// --- Configuration & Constants ---
const STATUS_CONFIG = {
  'terminé': { label: 'Terminée', color: 'bg-emerald-500', icon: <IoCheckmarkCircle className="w-4 h-4 text-white" /> },
  'en cours': { label: 'En cours', color: 'bg-yellow-500', icon: <IoPulse className="w-4 h-4 text-white" /> },
  'en attente': { label: 'En attente', color: 'bg-blue-500', icon: <IoTime className="w-4 h-4 text-white" /> },
  'annulé': { label: 'Annulée', color: 'bg-red-500', icon: <IoCloseCircle className="w-4 h-4 text-white" /> },
};
const CHART_COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];
const apiUrl = 'http://127.0.0.1:8000/api/v1';

// --- Helper & UI Components ---
const SkeletonCard = () => (
    <div className="p-5 bg-white dark:bg-gray-800/50 rounded-2xl shadow-md animate-pulse">
        <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="w-20 h-5 rounded-md bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="w-3/4 h-8 mb-2 rounded-md bg-gray-200 dark:bg-gray-700"></div>
        <div className="w-1/2 h-5 rounded-md bg-gray-200 dark:bg-gray-700"></div>
    </div>
);

const OverviewCard = ({ title, value, icon, trend, color, status }) => {
    const TrendIcon = trend >= 0 ? IoArrowUp : IoArrowDown;
    const trendColor = trend >= 0 ? 'text-emerald-500' : 'text-red-500';
    return (
        <div className="relative p-5 overflow-hidden text-white bg-gray-900 rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-1">
            <div className={`absolute top-0 left-0 w-full h-1 ${color}`}></div>
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full"></div>
            <div className="absolute -bottom-16 -left-4 w-40 h-40 bg-white/5 rounded-full"></div>
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg ${color} bg-opacity-20 text-white`}>{icon}</div>
                    {status && (
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${status.color} bg-opacity-20`}>
                           {status.icon}
                           <span>{status.label}</span>
                        </div>
                    )}
                </div>
                <div className="mt-auto">
                    <p className="mb-1 text-sm text-gray-300">{title}</p>
                    <p className="text-3xl font-bold">{value}</p>
                    <div className={`flex items-center mt-2 text-xs ${trendColor}`}>
                        <TrendIcon className="w-4 h-4 mr-1" />
                        <span>{Math.abs(trend)}% vs mois dernier</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChartContainer = ({ title, children }) => (
    <div className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl shadow-md h-full">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{title}</h3>
        {children}
    </div>
);

const CustomChartTooltip = ({ active, payload, label, valueFormatter }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3 bg-white dark:bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <p className="font-bold text-gray-800 dark:text-white">{label}</p>
                <p className="text-sm text-blue-500">{valueFormatter(payload[0].value)}</p>
            </div>
        );
    }
    return null;
};

const MonthlyTasksChart = ({ data }) => (
    <ChartContainer title="Activité Mensuelle">
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                <XAxis dataKey="month" tick={{ fill: 'rgb(107 114 128)' }} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: 'rgb(107 114 128)' }} fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip content={<CustomChartTooltip valueFormatter={v => `${v} tâches`} />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
);

const StatusPieChart = ({ data }) => (
    <ChartContainer title="Répartition par Statut">
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name">
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                </Pie>
                <RechartsTooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                        const { name, value, percentage } = payload[0].payload;
                        return (
                             <div className="p-3 bg-white dark:bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                                <p className="font-bold text-gray-800 dark:text-white">{STATUS_CONFIG[name]?.label || name}</p>
                                <p className="text-sm text-blue-500">{value} tâches ({percentage.toFixed(0)}%)</p>
                            </div>
                        );
                    }
                    return null;
                }} />
                <Legend iconType="circle" formatter={(value) => <span className="text-gray-600 dark:text-gray-300">{STATUS_CONFIG[value]?.label || value}</span>} />
            </PieChart>
        </ResponsiveContainer>
    </ChartContainer>
);

const RecentTasksList = ({ tasks }) => (
    <ChartContainer title="Tâches Récentes">
        <div className="space-y-3 pr-2 overflow-y-auto h-72">
            {tasks.length > 0 ? tasks.map(task => (
                <div key={task.task_id || task.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-all hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${STATUS_CONFIG[task.latestStatus]?.color || 'bg-gray-300'}`}>
                        {STATUS_CONFIG[task.latestStatus]?.icon}
                    </div>
                    <div className="flex-grow min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{task.task_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Échéance: {task.due_date ? new Date(task.due_date).toLocaleDateString('fr-FR') : 'N/A'}
                        </p>
                    </div>
                    <div className={`ml-3 flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full text-white ${STATUS_CONFIG[task.latestStatus]?.color || 'bg-gray-300'}`}>
                        {STATUS_CONFIG[task.latestStatus]?.label || task.latestStatus}
                    </div>
                </div>
            )) : <p className="text-center text-gray-500 dark:text-gray-400 mt-10">Aucune tâche récente.</p>}
        </div>
    </ChartContainer>
);

// --- Main Dashboard Component ---

export default function Statisticepardivision() {
    const { iddiv } = useParams();
    const [divisionData, setDivisionData] = useState({});
    const [tasks, setTasks] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [history, setHistory] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // --- Data Loading ---
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const divisionRes = await axios.get(`${apiUrl}/divisions/${iddiv}`);
            setDivisionData(divisionRes.data);

            const tasksRes = await axios.get(`${apiUrl}/tasks`);
            const divisionTasks = tasksRes.data.filter(task => task.division_id == iddiv);
            setTasks(divisionTasks);

            const [statusesRes, documentsRes] = await Promise.all([
                axios.get(`${apiUrl}/statuses`),
                axios.get(`${apiUrl}/documentpaths`)
            ]);

            // Process statuses
            const taskIds = divisionTasks.map(task => task.task_id);
            const filteredStatuses = statusesRes.data.filter(status => 
                taskIds.includes(status.task_id)
            );

            // Get latest status for each task
            const tasksWithLatestStatus = divisionTasks.map(task => {
                const taskStatuses = filteredStatuses
                    .filter(s => s.task_id === task.task_id)
                    .sort((a, b) => new Date(b.date_changed) - new Date(a.date_changed));
                return {
                    ...task,
                    latestStatus: taskStatuses[0]?.statut || 'en attente'
                };
            });

            // Status counts for pie chart
            const statusCounts = tasksWithLatestStatus.reduce((acc, task) => {
                acc[task.latestStatus] = (acc[task.latestStatus] || 0) + 1;
                return acc;
            }, {});

            setStatuses(Object.keys(statusCounts).map((statut, idx) => ({
                name: statut,
                value: statusCounts[statut],
                percentage: divisionTasks.length > 0 ? (statusCounts[statut] / divisionTasks.length) * 100 : 0,
                color: CHART_COLORS[idx % CHART_COLORS.length],
                statut,
                count: statusCounts[statut],
            })));

            // Process documents
            const filteredDocuments = documentsRes.data.filter(doc => 
                taskIds.includes(doc.task_id)
            );
            setDocuments(filteredDocuments);

            // Create history timeline
            const taskIdToName = divisionTasks.reduce((acc, task) => {
                acc[task.task_id] = task.task_name;
                return acc;
            }, {});

            const statusHistory = filteredStatuses.map(status => ({
                hist_id: status.status_id,
                description: `Task "${taskIdToName[status.task_id]}" status updated to ${status.statut}`,
                change_date: status.date_changed,
                task_id: status.task_id
            }));

            setHistory([...statusHistory].sort((a, b) => new Date(b.change_date) - new Date(a.change_date)));
        } catch (err) {
            setError('Échec du chargement du tableau de bord');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [iddiv]);

    const stats = useMemo(() => {
        const totalTasks = tasks.length;
        if (totalTasks === 0) {
            return {
                totalTasks: 0, completedTasks: 0, activeTasks: 0, pendingTasks: 0,
                divisionsCount: 1, monthlyTasks: [], statusDistribution: [],
                recentTasks: [], taskCompletionRate: 0,
            };
        }
        const statusCounts = tasks.reduce((acc, task) => {
            const status = task.latestStatus || 'en attente';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
        const monthlyTasks = Array.from({ length: 12 }, (_, i) => {
            const date = new Date(2025, i, 1);
            return { month: date.toLocaleString('fr-FR', { month: 'short' }), count: 0 };
        });
        tasks.forEach(task => {
            if (task.due_date) {
                const taskDate = new Date(task.due_date);
                if (taskDate.getFullYear() === 2025) {
                    const monthIndex = taskDate.getMonth();
                    if (monthlyTasks[monthIndex]) {
                        monthlyTasks[monthIndex].count++;
                    }
                }
            }
        });
        const statusDistribution = Object.keys(STATUS_CONFIG).map((status, index) => ({
            name: status,
            value: statusCounts[status] || 0,
            percentage: totalTasks > 0 ? ((statusCounts[status] || 0) / totalTasks) * 100 : 0,
            color: CHART_COLORS[index % CHART_COLORS.length]
        }));
        const recentTasks = [...tasks]
            .sort((a, b) => new Date(b.due_date || 0) - new Date(a.due_date || 0))
            .slice(0, 5);
        const completedTasks = statusCounts['terminé'] || 0;
        const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        return {
            totalTasks,
            completedTasks,
            activeTasks: statusCounts['en cours'] || 0,
            pendingTasks: statusCounts['en attente'] || 0,
            cancelledTasks: statusCounts['annulé'] || 0,
            divisionsCount: 1,
            monthlyTasks,
            statusDistribution,
            recentTasks,
            taskCompletionRate,
        };
    }, [tasks]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchData();
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
                    <XCircle className="w-12 h-12 mx-auto text-red-500" />
                    <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">Erreur de chargement</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tableau de Bord de la division</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Bienvenue, {divisionData.division_responsable} ({divisionData.division_nom})
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/50 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors disabled:opacity-50"
                >
                    <IoRefresh className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Actualiser
                </button>
            </header>

            <main>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (
                        <>
                            <OverviewCard title="Tâches Totales" value={stats.totalTasks} icon={<IoTrendingUp />} trend={12} color="bg-blue-500" />
                            <OverviewCard title="Tâches Terminées" value={stats.completedTasks} icon={<IoCheckmarkCircle />} trend={8} color="bg-emerald-500" status={STATUS_CONFIG['terminé']} />
                            <OverviewCard title="Tâches Actives" value={stats.activeTasks} icon={<IoPulse />} trend={-5} color="bg-yellow-500" status={STATUS_CONFIG['en cours']} />
                            <OverviewCard title="Documents" value={documents.length} icon={<IoBusiness />} trend={2} color="bg-purple-500" />
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {loading ? <SkeletonCard /> : <MonthlyTasksChart data={stats.monthlyTasks} />}
                    </div>
                    <div>
                        {loading ? <SkeletonCard /> : <StatusPieChart data={stats.statusDistribution} />}
                    </div>
                </div>

                 <div className="mt-6">
                     {loading ? <SkeletonCard /> : <RecentTasksList tasks={stats.recentTasks} />}
                 </div>

                <div className="mt-6">
                    <ChartContainer title="Documents récents">
                        <div className="space-y-3 pr-2 overflow-y-auto h-72">
                            {loading ? <SkeletonCard /> : (
                                documents.length > 0 ? documents.slice(0, 5).map((document, index) => (
                                    <div key={`document-${document.document_id}-${index}`} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-all hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <span className="documentIcon mr-3">📄</span>
                                        <div className="flex-grow min-w-0">
                                            <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{tasks.find(task => task.task_id === document.task_id)?.task_name || 'Tâche inconnue'}</p>
                                        </div>
                                        <button 
                                            onClick={async () => {
                                                const result = await downloadDocument(document.document_id);
                                                if (!result.success) {
                                                    alert(result.message || 'Erreur lors du téléchargement');
                                                }
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#4a6cf7',
                                                cursor: 'pointer',
                                                textDecoration: 'underline'
                                            }}
                                        >
                                            Télécharger le document
                                        </button>
                                    </div>
                                )) : <p className="text-center text-gray-500 dark:text-gray-400 mt-10">Aucun document récent.</p>
                            )}
                        </div>
                    </ChartContainer>
                </div>

                <div className="mt-6">
                    <ChartContainer title="Activité récente">
                        <div className="space-y-3 pr-2 overflow-y-auto h-72">
                            {loading ? <SkeletonCard /> : (
                                history.length > 0 ? history.slice(0, 10).map((activity, index) => (
                                    <div key={`activity-${activity.hist_id}-${index}`} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-all hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <div className="flex-grow min-w-0">
                                            <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{activity.description}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.change_date ? new Date(activity.change_date).toLocaleString('fr-FR') : ''}</p>
                                        </div>
                                    </div>
                                )) : <p className="text-center text-gray-500 dark:text-gray-400 mt-10">Aucune activité récente.</p>
                            )}
                        </div>
                    </ChartContainer>
                </div>
            </main>
        </div>
    );
}