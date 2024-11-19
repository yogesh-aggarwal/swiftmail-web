import { API } from "@api/api"
import Topbar from "@components/common/Topbar"
import RouteLayout from "@layouts/RouteLayout"
import {
   ArcElement,
   BarElement,
   CategoryScale,
   Chart as ChartJS,
   Legend,
   LinearScale,
   LineElement,
   PointElement,
   Title,
   Tooltip,
} from "chart.js"
import { Clock, Inbox, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { Bar, Line, Pie } from "react-chartjs-2"
import { useDashboard } from "src/lib/state"
import { Dashboard } from "src/lib/types/ui/dashboard"

// Register ChartJS components
ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
   ArcElement,
   BarElement
)

namespace Components {
   export function Header() {
      return (
         <Topbar
            actions={[
               {
                  name: "Overview",
                  active: true,
                  onClick: () => console.log("Overview clicked"),
               },
               {
                  name: "Analytics",
                  onClick: () => console.log("Analytics clicked"),
               },
               {
                  name: "Reports",
                  onClick: () => console.log("Reports clicked"),
               },
            ]}
            search={{
               placeholder: "Search in dashboard...",
               onSearch: (query) => console.log(query),
            }}
         />
      )
   }

   export function StatsCard({
      icon: Icon,
      label,
      value,
      trend,
   }: {
      icon: any
      label: string
      value: string | number
      trend?: string
   }) {
      return (
         <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
               <div className="rounded-lg bg-purple-bg p-3">
                  <Icon size={24} className="text-purple-600" />
               </div>
               {trend && (
                  <span className={`text-sm ${trend.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                     {trend}
                  </span>
               )}
            </div>
            <div className="mt-4">
               <h3 className="text-2xl font-semibold">{value}</h3>
               <p className="text-sm text-gray-600">{label}</p>
            </div>
         </div>
      )
   }

   export function EmailVolumeChart({ data }: { data: Dashboard["vitals"]["emailVolumeChart"] }) {
      const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">(data.timeRange)

      useEffect(() => {
         // Fetch new data when timeRange changes
         API.request({
            method: "GET",
            url: API.buildURL("/api/dashboard/email-volume", { timeRange }),
         })
      }, [timeRange])

      const chartData = {
         labels: data.data.map((item) => new Date(item.timestamp).toLocaleDateString()),
         datasets: [
            {
               label: "Email Volume",
               data: data.data.map((item) => item.count),
               borderColor: "rgb(147, 51, 234)",
               backgroundColor: "rgba(147, 51, 234, 0.1)",
               fill: true,
               tension: 0.4,
            },
         ],
      }

      const options = {
         responsive: true,
         plugins: {
            legend: {
               display: false,
            },
         },
         scales: {
            y: {
               beginAtZero: true,
               grid: {
                  display: false,
               },
            },
            x: {
               grid: {
                  display: false,
               },
            },
         },
      }

      return (
         <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
               <h3 className="text-lg font-medium">Email Volume</h3>
               <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
                  className="rounded-lg border border-gray-200 px-3 py-1 text-sm"
               >
                  <option value="day">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
               </select>
            </div>
            <Line data={chartData} options={options} />
         </div>
      )
   }

   export function PriorityDistributionChart({
      data,
   }: {
      data: Dashboard["contentStats"]["priorityDistribution"]
   }) {
      const chartData = {
         labels: ["High", "Medium", "Low"],
         datasets: [
            {
               data: [data.high, data.medium, data.low],
               backgroundColor: ["#ef4444", "#f59e0b", "#10b981"],
            },
         ],
      }

      const options = {
         responsive: true,
         plugins: {
            legend: {
               position: "bottom" as const,
            },
         },
      }

      return (
         <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium">Priority Distribution</h3>
            <Pie data={chartData} options={options} />
         </div>
      )
   }

   export function TopContributorsChart({ data }: { data: Dashboard["peopleStats"] }) {
      const chartData = {
         labels: data.slice(0, 5).map((item) => item.email),
         datasets: [
            {
               label: "Email Count",
               data: data.slice(0, 5).map((item) => item.emailCount),
               backgroundColor: "rgba(147, 51, 234, 0.8)",
            },
         ],
      }

      const options = {
         responsive: true,
         plugins: {
            legend: {
               display: false,
            },
         },
         scales: {
            y: {
               beginAtZero: true,
               grid: {
                  display: false,
               },
            },
            x: {
               grid: {
                  display: false,
               },
            },
         },
      }

      return (
         <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium">Top Contributors</h3>
            <Bar data={chartData} options={options} />
         </div>
      )
   }
}

export default function DashboardRoute() {
   const dashboard = useDashboard()

   if (!dashboard) {
      return (
         <RouteLayout topbar={<Components.Header />}>
            <div className="flex h-full items-center justify-center">
               <div className="text-sm opacity-50">Loading dashboard data...</div>
            </div>
         </RouteLayout>
      )
   }

   return (
      <RouteLayout topbar={<Components.Header />}>
         <div className="h-full space-y-4 overflow-y-auto p-6">
            <div className="grid grid-cols-12 gap-4">
               {/* Left Column */}
               <div className="col-span-8 space-y-4">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-4">
                     <Components.StatsCard
                        icon={Inbox}
                        label="Unread Emails"
                        value={dashboard.vitals.unreadCount}
                     />
                     <Components.StatsCard
                        icon={Clock}
                        label="Avg. Delivery Time"
                        value={`${dashboard.vitals.averageDeliveryTime}h`}
                     />
                     <Components.StatsCard
                        icon={Users}
                        label="Active Users"
                        value={dashboard.peopleStats.length}
                     />
                  </div>

                  {/* Email Volume Chart */}
                  <Components.EmailVolumeChart data={dashboard.vitals.emailVolumeChart} />

                  {/* Top Contributors */}
                  <div className="rounded-xl bg-white p-6 shadow-sm">
                     <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-medium">Top Contributors</h3>
                     </div>
                     <div className="space-y-4">
                        {dashboard.peopleStats.map((contributor, index) => (
                           <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-bg text-sm font-medium text-purple-600">
                                    {contributor.email.charAt(0).toUpperCase()}
                                 </div>
                                 <div>
                                    <div className="text-sm font-medium">{contributor.email}</div>
                                    <div className="text-xs text-gray-500">
                                       {contributor.emailCount} emails
                                    </div>
                                 </div>
                              </div>
                              <div className="text-sm font-medium">
                                 Score: {Math.round(contributor.importanceScore)}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Right Column */}
               <div className="col-span-4 space-y-4">
                  {/* Priority Distribution */}
                  <div className="rounded-xl bg-white p-6 shadow-sm">
                     <h3 className="mb-4 text-lg font-medium">Priority Distribution</h3>
                     <Components.PriorityDistributionChart
                        data={dashboard.contentStats.priorityDistribution}
                     />
                     <div className="mt-6 space-y-3">
                        {Object.entries(dashboard.contentStats.priorityDistribution).map(
                           ([priority, count]) => (
                              <div key={priority} className="flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                    <div
                                       className={`h-3 w-3 rounded-full ${
                                          priority === "high"
                                             ? "bg-red-500"
                                             : priority === "medium"
                                               ? "bg-amber-500"
                                               : "bg-emerald-500"
                                       }`}
                                    />
                                    <span className="text-sm capitalize">{priority}</span>
                                 </div>
                                 <span className="text-sm font-medium">{count}</span>
                              </div>
                           )
                        )}
                     </div>
                  </div>

                  {/* Category Distribution */}
                  <div className="rounded-xl bg-white p-6 shadow-sm">
                     <h3 className="mb-4 text-lg font-medium">Categories</h3>
                     <div className="space-y-3">
                        {dashboard.contentStats.categoryDistribution.map((category, index) => (
                           <div key={index} className="flex items-center justify-between">
                              <span className="text-sm">{category.category}</span>
                              <span className="text-sm font-medium">{category.count}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Label Distribution */}
                  <div className="rounded-xl bg-white p-6 shadow-sm">
                     <h3 className="mb-4 text-lg font-medium">Labels</h3>
                     <div className="space-y-3">
                        {dashboard.contentStats.labelDistribution.map((label, index) => (
                           <div key={index} className="flex items-center justify-between">
                              <span className="text-sm">{label.label}</span>
                              <span className="text-sm font-medium">{label.count}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </RouteLayout>
   )
}
