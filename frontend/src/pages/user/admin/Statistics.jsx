import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Alert,
  AlertTitle,
  Skeleton,
  useTheme,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
  alpha
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const apiUrl = 'http://127.0.0.1:8000/api/v1';

// Styled Components
const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: '100vh',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
    : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  transition: 'all 0.3s ease',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
    : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #6366f1, #a855f7)',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  height: '100%',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
    : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  transition: 'all 0.3s ease',
  boxShadow: theme.shadows[2],
  '&:hover': {
    boxShadow: theme.shadows[8],
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: status === 'en cours' 
    ? alpha(theme.palette.warning.main, 0.1)
    : status === 'terminé'
    ? alpha(theme.palette.success.main, 0.1)
    : status === 'annulé'
    ? alpha(theme.palette.error.main, 0.1)
    : alpha(theme.palette.info.main, 0.1),
  color: status === 'en cours'
    ? theme.palette.warning.main
    : status === 'terminé'
    ? theme.palette.success.main
    : status === 'annulé'
    ? theme.palette.error.main
    : theme.palette.info.main,
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
  textTransform: 'capitalize',
}));

// Status label mapping for French
const STATUS_LABELS_FR = {
  'terminé': 'Terminée',
  'en cours': 'En cours',
  'annulé': 'Annulée',
  'en attente': 'En attente',
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper 
        sx={{ 
          p: 2, 
          bgcolor: 'background.paper',
          boxShadow: 2,
          borderRadius: 2,
          backdropFilter: 'blur(8px)',
        }}
      >
        <Typography variant="subtitle2" color="text.primary" fontWeight="bold">
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography 
            key={index} 
            variant="body2" 
            color={entry.color}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: entry.color,
              }}
            />
            {entry.name}: {entry.value}
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number,
    color: PropTypes.string
  })),
  label: PropTypes.string
};

// Overview Card Component
const OverviewCard = ({ title, value, icon, trend, color, status }) => {
  const theme = useTheme();
  const TrendIcon = trend > 0 ? ArrowUpwardIcon : ArrowDownwardIcon;
  const trendColor = trend > 0 ? theme.palette.success.main : theme.palette.error.main;

  return (
    <StyledCard>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(color, 0.2)} 0%, ${alpha(color, 0.1)} 100%)`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          {status && (
            <StatusChip 
              status={status}
              label={STATUS_LABELS_FR[status] || status}
              size="small"
            />
          )}
        </Box>
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            mb: 1,
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.text.primary, 0.8)} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {value}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 1, fontWeight: 500 }}
        >
          {title}
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: trendColor,
            fontWeight: 600,
          }}
        >
          <TrendIcon sx={{ fontSize: 16, mr: 0.5 }} />
          <Typography variant="caption">
                          {Math.abs(trend)}% par rapport au mois dernier
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

OverviewCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  trend: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  status: PropTypes.string
};

export default function Statistics() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    activeTasks: 0,
    pendingTasks: 0,
    divisions: 0,
    monthlyTasks: [],
    statusDistribution: [],
    recentTasks: [],
    taskCompletionRate: 0
  });

  const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Récupération des données depuis:', apiUrl);
        
        const [tasksRes, divisionsRes, statusesRes] = await Promise.all([
          axios.get(`${apiUrl}/tasks`),
          axios.get(`${apiUrl}/divisions`),
          axios.get(`${apiUrl}/statuses`)
        ]);

        const tasks = tasksRes.data;
        const divisions = divisionsRes.data;
        const allStatuses = statusesRes.data;

        console.log('Données API brutes:', { tasks, divisions, allStatuses });

        // Obtenir le dernier statut pour chaque tâche
        const tasksWithLatestStatus = tasks.map(task => {
          const taskStatuses = allStatuses
            .filter(s => s.task_id === task.task_id)
            .sort((a, b) => new Date(b.date_changed) - new Date(a.date_changed));
          
                      // Obtenir le dernier statut ou par défaut 'en attente'
          const latestStatus = taskStatuses[0]?.statut || 'en attente';
          
                      // S'assurer que la tâche a des données valides
          const taskWithStatus = { 
            ...task, 
            status: latestStatus,
            due_date: task.due_date || null,
                          task_name: task.task_name || 'Tâche sans nom'
          };
          
          return taskWithStatus;
        });

        console.log('Tâches avec statut:', tasksWithLatestStatus);

        // Calculer les statistiques en utilisant des correspondances de statut exactes
        const completedTasks = tasksWithLatestStatus.filter(task => 
          task.status === 'terminé'
        ).length;

        const activeTasks = tasksWithLatestStatus.filter(task => 
          task.status === 'en cours'
        ).length;

        const pendingTasks = tasksWithLatestStatus.filter(task =>
          task.status === 'en attente'
        ).length;

        console.log('Compteurs de statut:', { completedTasks, activeTasks, pendingTasks });

        const monthlyTasks = calculateMonthlyTasks(tasksWithLatestStatus);
        const statusDistribution = calculateStatusDistribution(tasksWithLatestStatus);
        const recentTasks = tasksWithLatestStatus
          .sort((a, b) => {
            try {
              const dateA = new Date(a.due_date || 0);
              const dateB = new Date(b.due_date || 0);
              return dateB.getTime() - dateA.getTime();
            } catch (error) {
              console.warn('Erreur lors du tri des tâches par date:', error);
              return 0;
            }
          })
          .slice(0, 5);

        // Calculer le taux de completion basé sur les tâches terminées
        const taskCompletionRate = tasks.length > 0 
          ? (completedTasks / tasks.length) * 100 
          : 0;

        setStats({
          totalTasks: tasks.length,
          completedTasks,
          activeTasks,
          pendingTasks,
          divisions: divisions.length,
          monthlyTasks,
          statusDistribution,
          recentTasks,
          taskCompletionRate
        });
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des statistiques:', err);
        console.error('Détails de l\'erreur:', err.response?.data || err.message);
                  setError(`Échec du chargement des données statistiques: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchData();
    }, []);

  const calculateMonthlyTasks = (tasks) => {
    // Obtenir l'année actuelle
    const currentYear = new Date().getFullYear();
    
    // Initialiser tous les mois avec 0
    const monthlyData = {};
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, i, 1);
      const month = date.toLocaleString('default', { month: 'short' });
      monthlyData[month] = 0;
    }

    // Count tasks by month
    tasks.forEach(task => {
      if (task.due_date) {
        try {
          const date = new Date(task.due_date);
          if (!isNaN(date.getTime())) {
            const month = date.toLocaleString('default', { month: 'short' });
            monthlyData[month]++;
          }
        } catch (error) {
          console.warn('Format de date invalide pour la tâche:', task.task_id, task.due_date);
        }
      }
    });

    // Convert to array and sort by month index
    return Object.entries(monthlyData)
      .map(([month, count]) => ({
        month,
        count,
        monthIndex: new Date(Date.parse(month + " 1, " + currentYear)).getMonth()
      }))
      .sort((a, b) => a.monthIndex - b.monthIndex)
      .map(({ month, count }) => ({ month, count }));
  };

  const calculateStatusDistribution = (tasks) => {
    // Status colors for charts
    const STATUS_COLORS = {
      'en attente': '#1976d2', // Blue
      'terminé': '#9c27b0',   // Purple
      'en cours': '#2e7d32',    // Green
      'annulé': '#d32f2f' // Red
    };

    // Initialize counters with fixed order
    const statusCounts = {
      'en attente': 0,
      'terminé': 0,
      'en cours': 0,
      'annulé': 0
    };
    
    // Count tasks by status
    tasks.forEach(task => {
      const status = task.status || 'en attente';
      if (Object.prototype.hasOwnProperty.call(statusCounts, status)) {
        statusCounts[status]++;
      } else {
        statusCounts['en attente']++;
      }
    });
    
    // Convert to array format needed for pie chart
    return Object.entries(statusCounts).map(([status, count]) => ({ 
      name: status,
      status,
      count,
      value: count,
      color: STATUS_COLORS[status],
      percentage: tasks.length > 0 ? (count / tasks.length) * 100 : 0
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Aucune date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date invalide';
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <DashboardContainer>
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Erreur</AlertTitle>
          {error}
        </Alert>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 2, 
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.text.primary, 0.8)} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Statistiques
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title="Actualiser les données">
            <IconButton 
              onClick={fetchData}
              disabled={loading}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              <RefreshIcon sx={{ 
                animation: loading ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Overview Cards */}
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
          ) : (
            <OverviewCard
              title="Tâches totales"
              value={stats.totalTasks}
              icon={<AssignmentIcon />}
              trend={12}
              color={theme.palette.primary.main}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
          ) : (
            <OverviewCard
              title="Tâches terminées"
              value={stats.completedTasks}
              icon={<TrendingUpIcon />}
              trend={8}
              color={theme.palette.success.main}
              status="terminé"
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
          ) : (
            <OverviewCard
              title="Tâches actives"
              value={stats.activeTasks}
              icon={<AssignmentIcon />}
              trend={5}
              color={theme.palette.warning.main}
              status="en cours"
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
          ) : (
            <OverviewCard
              title="Divisions"
              value={stats.divisions}
              icon={<BusinessIcon />}
              trend={3}
              color={theme.palette.secondary.main}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
          ) : (
            <OverviewCard
              title="Tâches annulées"
              value={stats.statusDistribution.find(s => s.status === 'annulé')?.count || 0}
              icon={<AssignmentIcon />}
              trend={0}
              color={theme.palette.error.main}
              status="annulé"
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
          ) : (
            <OverviewCard
              title="Tâches en attente"
              value={stats.statusDistribution.find(s => s.status === 'en attente')?.count || 0}
              icon={<AssignmentIcon />}
              trend={0}
              color={theme.palette.info.main}
              status="en attente"
            />
          )}
        </Grid>

        {/* Monthly Tasks Chart */}
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.text.primary, 0.8)} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Répartition mensuelle des tâches
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            ) : stats.monthlyTasks.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Aucune donnée mensuelle disponible
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlyTasks}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={alpha(theme.palette.divider, 0.2)}
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: theme.palette.text.secondary }}
                    axisLine={{ stroke: theme.palette.divider }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: theme.palette.text.secondary }}
                    axisLine={{ stroke: theme.palette.divider }}
                    tickLine={false}
                    domain={[0, 'auto']}
                    allowDecimals={false}
                  />
                  <RechartsTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <Paper 
                            sx={{ 
                              p: 1.5,
                              bgcolor: 'background.paper',
                              boxShadow: 1,
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="body2">
                              {payload[0].payload.month}: {payload[0].value} tâches
                            </Typography>
                          </Paper>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#1976d2"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </StyledPaper>
        </Grid>

        {/* Status Distribution */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.text.primary, 0.8)} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Répartition par statut
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            ) : stats.statusDistribution.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Aucune donnée de statut disponible
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="name"
                  >
                    {stats.statusDistribution.map((entry) => (
                      <Cell 
                        key={entry.name}
                        fill={entry.color}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom"
                    formatter={(value) => STATUS_LABELS_FR[value] || value}
                    iconType="square"
                  />
                  <RechartsTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <Paper 
                            sx={{ 
                              p: 1.5,
                              bgcolor: 'background.paper',
                              boxShadow: 1,
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="body2" sx={{ color: data.color }}>
                              {STATUS_LABELS_FR[data.name] || data.name}: {data.count} tâches ({data.percentage.toFixed(0)}%)
                            </Typography>
                          </Paper>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </StyledPaper>
        </Grid>

        {/* Recent Tasks */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.text.primary, 0.8)} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Tâches récentes
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            ) : stats.recentTasks.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Aucune tâche trouvée
                </Typography>
              </Box>
            ) : (
              <List>
                {stats.recentTasks.map((task) => (
                  <ListItem
                    key={task.task_id}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.background.paper, 0.5),
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(4px)',
                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                        }}
                      >
                        {task.task_name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={task.task_name}
                      secondary={
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <StatusChip 
                            status={task.status}
                            label={STATUS_LABELS_FR[task.status] || task.status}
                            size="small"
                          />
                          <Typography variant="caption" color="text.secondary" component="span">
                            Échéance: {formatDate(task.due_date)}
                          </Typography>
                        </Box>
                      }
                      secondaryTypographyProps={{ component: 'span' }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </StyledPaper>
        </Grid>

        {/* Task Completion Rate */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.text.primary, 0.8)} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Taux d'achèvement des tâches
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            ) : (
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700,
                      color: theme.palette.primary.main
                    }}
                  >
                    {stats.taskCompletionRate.toFixed(1)}%
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ ml: 2 }}
                  >
                    {stats.completedTasks} sur {stats.totalTasks} tâches terminées
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.taskCompletionRate}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: theme.palette.primary.main,
                    },
                  }}
                />
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mt: 2,
                  alignItems: 'flex-start'
                }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tâches actives: {stats.activeTasks}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tâches en attente: {stats.pendingTasks}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                    >
                      Objectif: 100%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </StyledPaper>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
}