"use client";

import ProtectedRoute from "@/app/_components/ProtectedRoute";
import { DollarSign, ShoppingCart, Users, TrendingUp, TrendingDown, MoreHorizontal, ChevronDown } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const stats = [
  {
    title: "Total Gross",
    value: "$983,410",
    change: "+2.3%",
    changeText: "vs last week",
    trend: "up",
    icon: DollarSign,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    title: "Total Orders",
    value: "58,375",
    change: "-2.89%",
    changeText: "vs last week",
    trend: "down",
    icon: ShoppingCart,
    bgColor: "bg-white",
    iconColor: "text-gray-700",
  },
  {
    title: "Total Visitors",
    value: "237,782",
    change: "+8.60%",
    changeText: "vs last week",
    trend: "up",
    icon: Users,
    bgColor: "bg-white",
    iconColor: "text-gray-700",
  },
];

const revenueData = [
  { date: "9 Aug", value: 8000 },
  { date: "10 Aug", value: 12000 },
  { date: "11 Aug", value: 10000 },
  { date: "12 Aug", value: 14000 },
  { date: "13 Aug", value: 11000 },
  { date: "14 Aug", value: 16000 },
  { date: "15 Aug", value: 14521 },
  { date: "16 Aug", value: 13000 },
  { date: "17 Aug", value: 15000 },
];

const categoryData = [
  { name: "Electronics", value: 3400000, color: "#FF8A3D" },
  { name: "Fashion", value: 990000, color: "#FFB366" },
  { name: "Home & Kitchen", value: 750000, color: "#FFC999" },
  { name: "Beauty & Personal Care", value: 500000, color: "#FFE0CC" },
];

const userSources = [
  { name: "United States", value: 25000, change: "+5%", color: "#FF8A3D" },
  { name: "United Kingdom", value: 12000, change: "-8%", color: "#FFB366" },
  { name: "Indonesia", value: 17200, change: "+12%", color: "#FFC999" },
  { name: "Russia", value: 10000, change: "+3%", color: "#FFE0CC" },
];

const conversionData = [
  { name: "Today", value: 25000, change: "-8%" },
  { name: "Yesterday", value: 12000, change: "-8%" },
  { name: "This Week", value: 8500, change: "-8%" },
  { name: "This Month", value: 6200, change: "-8%" },
  { name: "Last Month", value: 3000, change: "-8%" },
];

const trafficSources = [
  { name: "Direct Traffic", value: 40, color: "#FF8A3D" },
  { name: "Organic Search", value: 30, color: "#FFB366" },
  { name: "Social Media", value: 15, color: "#FFC999" },
  { name: "Referral Traffic", value: 10, color: "#FFE0CC" },
  { name: "Email Campaigns", value: 5, color: "#FFF0E5" },
];

const recentOrders = [
  { id: "#10234", customer: "Ananya Walter", product: "Wireless Headphones", qty: 2, total: "$300", status: "Shipped" },
  { id: "#10235", customer: "Sebastian Adams", product: "Running Shoes", qty: 1, total: "$75", status: "Processing" },
  { id: "#10236", customer: "Suzanne Wright", product: "Smartwatch", qty: 1, total: "$200", status: "Delivered" },
  { id: "#10237", customer: "Peter Havel", product: "Coffee Maker", qty: 1, total: "$80", status: "Pending" },
  { id: "#10238", customer: "Aria Singh", product: "Bluetooth Speaker", qty: 3, total: "$120", status: "Shipped" },
];

const recentActivity = [
  { text: "Olivia purchased purchased 2 items totaling $250", time: "10:30 AM" },
  { text: "The price of \"Smart TV\" was updated from $500 to $450", time: "9:45 AM" },
  { text: "Vincent Laurent left a 5-star review for \"Wireless Headphones\"", time: "8:20 AM" },
  { text: "\"Running Shoes\" stock is below 10 units", time: "7:15 AM" },
  { text: "Payment of $1,200 order is \"Processing\"", time: "6:00 AM" },
];

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={stat.title} className={`rounded-2xl ${stat.bgColor} p-6 shadow-sm`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <h3 className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</h3>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`flex items-center text-sm font-semibold ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.trend === "up" ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500">{stat.changeText}</span>
                  </div>
                </div>
                <div className={`rounded-xl ${index === 0 ? "bg-orange-500" : "bg-gray-100"} p-3`}>
                  <stat.icon className={`h-6 w-6 ${index === 0 ? "text-white" : stat.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Analytics & Monthly Target */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Revenue Analytics */}
          <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
                <p className="mt-1 text-sm text-gray-500">Last 7 Days vs Previous 7 Days</p>
              </div>
              <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
                Last 6 Days
              </button>
            </div>
            <div className="mb-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">$14,521</span>
              <span className="text-sm text-gray-500">Revenue</span>
            </div>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF8A3D" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#FF8A3D" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#FF8A3D" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Target */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Monthly Target</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            <div className="relative mx-auto h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: 85 }, { value: 15 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    <Cell fill="#FF8A3D" />
                    <Cell fill="#F3F4F6" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">85%</span>
                <span className="text-sm text-gray-500">Great Progress</span>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Target</span>
                <span className="font-semibold text-gray-900">$3,400,000</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                  <span className="text-gray-600">Electronics</span>
                </div>
                <span className="font-semibold text-gray-900">$1,200,000</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-300"></div>
                  <span className="text-gray-600">Fashion</span>
                </div>
                <span className="font-semibold text-gray-900">$990,000</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-200"></div>
                  <span className="text-gray-600">Home & Kitchen</span>
                </div>
                <span className="font-semibold text-gray-900">$750,000</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-100"></div>
                  <span className="text-gray-600">Beauty & Personal Care</span>
                </div>
                <span className="font-semibold text-gray-900">$500,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active User, Conversion Rate & Traffic Sources */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active User */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Active User</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">2,758</span>
              <span className="flex items-center text-sm font-semibold text-green-600">
                <TrendingUp className="mr-1 h-4 w-4" />
                +8.23%
              </span>
            </div>
            <p className="mb-6 text-sm text-gray-500">than last week</p>
            <div className="space-y-3">
              {userSources.map((source, index) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: source.color }}></div>
                    <span className="text-sm text-gray-600">{source.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{source.value.toLocaleString()}</span>
                    <span className={`text-xs ${source.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {source.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Conversion Rate</h3>
              <button className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white">
                This Week
              </button>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionData} layout="horizontal">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} width={80} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {conversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#FF8A3D" : "#F3F4F6"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Traffic Sources</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              {trafficSources.map((source) => (
                <div key={source.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: source.color }}></div>
                      <span className="text-gray-600">{source.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{source.value}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full" style={{ width: `${source.value}%`, backgroundColor: source.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders & Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Orders */}
          <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
              <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
                All Categories
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Qty</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 text-sm">
                      <td className="py-4 font-semibold text-gray-900">{order.id}</td>
                      <td className="py-4 text-gray-600">{order.customer}</td>
                      <td className="py-4 text-gray-600">{order.product}</td>
                      <td className="py-4 text-gray-600">{order.qty}</td>
                      <td className="py-4 font-semibold text-gray-900">{order.total}</td>
                      <td className="py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          order.status === "Shipped" ? "bg-orange-50 text-orange-600" :
                          order.status === "Processing" ? "bg-blue-50 text-blue-600" :
                          order.status === "Delivered" ? "bg-green-50 text-green-600" :
                          "bg-yellow-50 text-yellow-600"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-50">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{activity.text}</p>
                    <p className="mt-1 text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

