import HeatMap from "@uiw/react-heat-map";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "../config";
import { useTheme } from "../contexts/ThemeContext";


// Chart configs
const CHARTS = [
  {
    label: "Today's Projects",
    endpoint: "today",
    color: "#10B981", // emerald-500
    bgLight: "from-emerald-100 to-emerald-200",
    bgDark: "from-emerald-900 to-emerald-800",
  },
  {
    label: "This Week's Projects",
    endpoint: "thisweek",
    color: "#4F46E5", // indigo-700
    bgLight: "from-indigo-100 to-indigo-200",
    bgDark: "from-indigo-900 to-indigo-800",
  },
  {
    label: "This Month's Projects",
    endpoint: "thismonth",
    color: "#F59E42", // orange-400
    bgLight: "from-orange-100 to-orange-200",
    bgDark: "from-orange-900 to-orange-800",
  },
];

// Heatmap colors
const githubColors = [
  "#ebedf0", // 0
  "#c6e48b", // 1-3
  "#7bc96f", // 4-7
  "#239a3b", // 8-11
  "#196127", // 12+
];

function getPanelColor(count) {
  if (count === 0) return githubColors[0];
  if (count <= 3) return githubColors[1];
  if (count <= 7) return githubColors[2];
  if (count <= 11) return githubColors[3];
  return githubColors[4];
}

function StatDonut({
  label,
  stats,
  loading,
  color,
  animatedPercent,
  bg,
  darkMode,
}) {
  const COLORS = [color, darkMode ? "#23272e" : "#E5E7EB"];
  const completed = stats.completed;
  const remaining = stats.total - stats.completed;
  const data = [
    { name: "Completed", value: completed },
    { name: "Remaining", value: remaining > 0 ? remaining : 0 },
  ];

  return (
    <div
      className={`
        flex flex-col items-center w-full max-w-xs rounded-3xl shadow-xl p-6 m-2
        bg-gradient-to-br ${bg}
        transition-colors border border-opacity-10
        ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
        ${
          stats.total > 0 ? "hover:scale-105 hover:shadow-2xl duration-300" : ""
        }
      `}
      style={{ minHeight: 320 }}
    >
      <h3
        className={`text-lg font-semibold mb-4 text-center drop-shadow ${
          darkMode ? "text-gray-100" : "text-gray-800"
        }`}
      >
        {label}
      </h3>
      {loading ? (
        <div className={darkMode ? "text-gray-500" : "text-gray-400"}>
          Loading...
        </div>
      ) : stats.total === 0 ? (
        <div
          className={`text-lg text-center h-[120px] flex items-center justify-center ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <span className="animate-pulse">No projects!</span>
        </div>
      ) : (
        <PieChart width={180} height={180}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={75}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            isAnimationActive={true}
            animationDuration={1200}
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx]} />
            ))}
          </Pie>
          <text
            x={90}
            y={100}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={32}
            fill={color}
            fontWeight="bold"
            className="drop-shadow"
          >
            {`${animatedPercent}%`}
          </text>
        </PieChart>
      )}
      {stats.total > 0 && (
        <div
          className={`mt-2 text-sm text-center ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <span className="font-bold">{stats.completed}</span> completed out of{" "}
          <span className="font-bold">{stats.total}</span>
        </div>
      )}
    </div>
  );
}

function StatPage() {
  const { darkMode } = useTheme();
  const { user_id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // State for donut charts
  const [stats, setStats] = useState([
    { total: 0, completed: 0 },
    { total: 0, completed: 0 },
    { total: 0, completed: 0 },
  ]);
  const [loading, setLoading] = useState([true, true, true]);
  const [animatedPercent, setAnimatedPercent] = useState([0, 0, 0]);

  // State for heatmap
  const [heatmapData, setHeatmapData] = useState([]);
  const [heatmapLoading, setHeatmapLoading] = useState(true);

  // State for area chart (weekly deadlines)
  const [weeklyDeadlineData, setWeeklyDeadlineData] = useState([]);
  const [weeklyDeadlineLoading, setWeeklyDeadlineLoading] = useState(true);

  // Fetch stats for all three donut charts
  useEffect(() => {
    CHARTS.forEach((chart, idx) => {
      setLoading((prev) => {
        const arr = [...prev];
        arr[idx] = true;
        return arr;
      });
      fetch(
        `${API_BASE_URL}/stats/projects-${chart.endpoint}/${user_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setStats((prev) => {
            const arr = [...prev];
            arr[idx] = data;
            return arr;
          });
          setLoading((prev) => {
            const arr = [...prev];
            arr[idx] = false;
            return arr;
          });
        })
        .catch(() => {
          setLoading((prev) => {
            const arr = [...prev];
            arr[idx] = false;
            return arr;
          });
        });
    });
  }, [user_id, token]);

  // Fetch heatmap data
  useEffect(() => {
    setHeatmapLoading(true);
    fetch(`${API_BASE_URL}/${user_id}/statistics`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setHeatmapData(data.value || []);
        setHeatmapLoading(false);
      })
      .catch(() => setHeatmapLoading(false));
  }, [user_id, token]);

  // Fetch area chart data (weekly deadlines)
  useEffect(() => {
    setWeeklyDeadlineLoading(true);
    fetch(`${API_BASE_URL}/stats/weekly-deadlines/${user_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setWeeklyDeadlineData(data.data || []);
        setWeeklyDeadlineLoading(false);
      })
      .catch(() => setWeeklyDeadlineLoading(false));
  }, [user_id, token]);

  // Animate percentage for each donut chart
  useEffect(() => {
    stats.forEach((stat, idx) => {
      if (stat.total === 0) {
        setAnimatedPercent((prev) => {
          const arr = [...prev];
          arr[idx] = 0;
          return arr;
        });
        return;
      }
      let percent = Math.round((stat.completed / stat.total) * 100);
      let current = 0;
      const step = () => {
        if (current < percent) {
          current += 1;
          setAnimatedPercent((prev) => {
            const arr = [...prev];
            arr[idx] = current;
            return arr;
          });
          setTimeout(step, 10);
        } else {
          setAnimatedPercent((prev) => {
            const arr = [...prev];
            arr[idx] = percent;
            return arr;
          });
        }
      };
      step();
    });
  }, [stats]);

  return (
    <div
      className={`min-h-screen transition-colors ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Project Completion Section */}
        <h2
          className={`text-3xl font-bold mb-10 text-center drop-shadow ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Project Completion Overview
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-20">
          {CHARTS.map((chart, idx) => (
            <StatDonut
              key={chart.label}
              label={chart.label}
              stats={stats[idx]}
              loading={loading[idx]}
              color={chart.color}
              animatedPercent={animatedPercent[idx]}
              bg={darkMode ? chart.bgDark : chart.bgLight}
              darkMode={darkMode}
            />
          ))}
        </div>

        {/* Weekly Project Deadlines Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="flex flex-col items-center justify-center py-10"
        >
          <motion.h2
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg ${
              darkMode ? "dark:text-white" : ""
            }`}
          >
            Projects Due This Week
          </motion.h2>
          <div
            className={`w-full max-w-3xl mx-auto rounded-2xl shadow-xl p-6 mb-12 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {weeklyDeadlineLoading ? (
              <div className={darkMode ? "text-gray-400" : "text-gray-500"}>
                Loading chart...
              </div>
            ) : weeklyDeadlineData.length === 0 ? (
              <div className={darkMode ? "text-gray-400" : "text-gray-500"}>
                No project deadlines this week.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={weeklyDeadlineData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    dataKey="date"
                    stroke={darkMode ? "#e5e7eb" : "#374151"}
                    tickFormatter={(date) => {
                      const d = new Date(date);
                      const day = String(d.getDate()).padStart(2, "0");
                      const month = String(d.getMonth() + 1).padStart(2, "0");
                      return `${day}/${month}`;
                    }}
                  />
                  <YAxis
                    allowDecimals={false}
                    stroke={darkMode ? "#e5e7eb" : "#374151"}
                  />
                  <Tooltip
                    contentStyle={{
                      background: darkMode ? "#1f2937" : "#fff",
                      borderColor: darkMode ? "#374151" : "#e5e7eb",
                      color: darkMode ? "#fff" : "#111",
                    }}
                    labelStyle={{ color: darkMode ? "#fff" : "#111" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={darkMode ? "#38bdf8" : "#6366f1"}
                    fill={darkMode ? "#38bdf880" : "#6366f180"}
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Activity Heatmap Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="flex flex-col items-center justify-center py-10"
        >
          <motion.h2
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`text-3xl font-bold mb-8 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg ${
              darkMode ? "dark:text-white" : ""
            }`}
          >
            Activity Heatmap
          </motion.h2>

          {heatmapLoading ? (
            <div
              className={`text-center ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Loading heatmap...
            </div>
          ) : (
            <div
              className={`rounded-xl shadow-xl p-6 ${
                darkMode ? "bg-white/80" : "bg-white/80"
              }`}
            >
              <HeatMap
                value={heatmapData}
                width={700}
                rectSize={16}
                space={4}
                startDate={new Date("2025/01/06")}
                panelColors={githubColors}
                rectProps={{
                  rx: 4,
                  style: {
                    stroke: darkMode ? "#374151" : "#e1e4e8",
                    strokeWidth: 1,
                  },
                }}
                rectRender={(props, data) => (
                  <rect
                    {...props}
                    fill={getPanelColor(data.count || 0)}
                    style={{
                      ...props.style,
                      transition: "fill 0.3s",
                      cursor: data.count ? "pointer" : "default",
                    }}
                  >
                    <title>
                      {data.date}: {data.count || 0} activities
                    </title>
                  </rect>
                )}
              />
              <div
                className={`mt-8 flex gap-2 items-center justify-center ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <span className="text-xs">Less</span>
                {githubColors.map((color, idx) => (
                  <span
                    key={idx}
                    className="w-6 h-4 rounded"
                    style={{
                      background: color,
                      display: "inline-block",
                      border: darkMode
                        ? "1px solid #374151"
                        : "1px solid #e1e4e8",
                    }}
                  />
                ))}
                <span className="text-xs">More</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default StatPage;
