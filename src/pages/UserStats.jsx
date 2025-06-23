import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Cell, Pie, PieChart } from "recharts";
import Navbar from "../components/Navbar";
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

function StatDonut({ label, stats, loading, color, animatedPercent, bg, darkMode }) {
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
        ${stats.total > 0 ? "hover:scale-105 hover:shadow-2xl duration-300" : ""}
      `}
      style={{ minHeight: 320 }}
    >
      <h3 className={`text-lg font-semibold mb-4 text-center drop-shadow ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
        {label}
      </h3>
      {loading ? (
        <div className={darkMode ? "text-gray-500" : "text-gray-400"}>Loading...</div>
      ) : stats.total === 0 ? (
        <div className={`text-lg text-center h-[120px] flex items-center justify-center ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
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
        <div className={`mt-2 text-sm text-center ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          <span className="font-bold">{stats.completed}</span> completed out of <span className="font-bold">{stats.total}</span>
        </div>
      )}
    </div>
  );
}

function UserStats() {
  const { darkMode } = useTheme();
  const { user_id } = useParams();
  const token = localStorage.getItem("token");

  // State for each chart
  const [stats, setStats] = useState([
    { total: 0, completed: 0 },
    { total: 0, completed: 0 },
    { total: 0, completed: 0 },
  ]);
  const [loading, setLoading] = useState([true, true, true]);
  const [animatedPercent, setAnimatedPercent] = useState([0, 0, 0]);

  // Fetch stats for all three charts
  useEffect(() => {
    CHARTS.forEach((chart, idx) => {
      setLoading((prev) => {
        const arr = [...prev];
        arr[idx] = true;
        return arr;
      });
      fetch(`${API_BASE_URL}/stats/projects-${chart.endpoint}/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
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
    // eslint-disable-next-line
  }, [user_id]);

  // Animate percentage for each chart
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
    <div className={`min-h-screen transition-colors ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className={`text-3xl font-bold mb-10 text-center drop-shadow ${darkMode ? "text-white" : "text-gray-900"}`}>
          Project Completion Overview
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
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
      </div>
    </div>
  );
}

export default UserStats;