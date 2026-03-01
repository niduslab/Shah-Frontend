"use client";

import { ArrowUpRight, FolderOpen, Users, Wallet } from "lucide-react";
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const stats = [
  {
    title: "Total Members",
    value: "1,847",
    change: "12% from last month",
    icon: Users,
    iconColor: "text-[#0F9D58]",
    iconBg: "bg-[#0F9D58]/10",
    changeColor: "text-[#0F9D58]",
  },
  {
    title: "Active Projects",
    value: "06",
    change: "2 new this quarter",
    icon: FolderOpen,
    iconColor: "text-[#0F9D58]",
    iconBg: "bg-[#0F9D58]/10",
    changeColor: "text-[#0F9D58]",
  },
  {
    title: "Total Collections",
    value: "৳24.5L",
    change: "8.2% from last month",
    icon: ArrowUpRight,
    iconColor: "text-[#0F9D58]",
    iconBg: "bg-[#0F9D58]/10",
    changeColor: "text-[#0F9D58]",
  },
  {
    title: "Wallet Balance",
    value: "৳8,42,000",
    change: "৳ 1.2L pending",
    icon: Wallet,
    iconColor: "text-[#0F9D58]",
    iconBg: "bg-[#0F9D58]/10",
    changeColor: "text-[#0F9D58]",
  },
];

const collectionData = [
  { name: "Jul", value: 20 },
  { name: "Aug", value: 30 },
  { name: "Sep", value: 28 },
  { name: "Oct", value: 40 },
  { name: "Nov", value: 45 },
  { name: "Dec", value: 42 },
  { name: "Jan", value: 50 },
];

const packageData = [
  { name: "300/mo", value: 320, color: "#0F9D58" },
  { name: "700/mo", value: 480, color: "#8BDB81" },
  { name: "1000/mo", value: 290, color: "#F7B924" },
  { name: "1500/mo", value: 150, color: "#4285F4" },
];

export default function AdminPage() {
  return (
    <div className="space-y-8 p-2">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-500">Welcome back! Here&apos;s what&apos;s happening at Expro Welfare Foundation today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className={`rounded-lg p-3 ${stat.iconBg}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </div>
            <div className={`mt-4 flex items-center text-sm font-medium ${stat.changeColor}`}>
              <ArrowUpRight className="mr-1 h-4 w-4" />
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Collection Trend */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Collection Trend</h3>
              <p className="text-sm text-gray-500">Monthly pension & membership collections</p>
            </div>
            <select className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 outline-none focus:border-[#0F9D58]">
              <option>Last 7 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={collectionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F9D58" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0F9D58" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#0F9D58" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Package Distribution */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Package Distribution</h3>
            <p className="text-sm text-gray-500">Members by pension package</p>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={packageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {packageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {packageData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-gray-600">৳{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

