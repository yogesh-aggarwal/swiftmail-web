import { makeStore } from "common-react-toolkit"
import { AnimatePresence, motion } from "framer-motion"
import { Mail, Plus, X } from "lucide-react"
import { useState } from "react"
import { useUser } from "src/lib/state"

const [settingsStore, useSettings] = makeStore<boolean>(false, {}, {})

export { settingsStore }

namespace Components {
   export function Section(props: { title: string; children: React.ReactNode }) {
      return (
         <div className="space-y-4">
            <div className="text-lg font-medium">{props.title}</div>
            <div className="space-y-4">{props.children}</div>
         </div>
      )
   }

   export function Toggle(props: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
      return (
         <div className="flex items-center justify-between">
            <span className="text-sm">{props.label}</span>
            <div
               onClick={() => props.onChange(!props.checked)}
               className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                  props.checked ? "bg-black" : "bg-gray-200"
               }`}
            >
               <div
                  className={`absolute left-0.5 top-0.5 h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                     props.checked ? "translate-x-5" : "translate-x-0"
                  }`}
               />
            </div>
         </div>
      )
   }

   type FocusHourRange = {
      id: string
      start: string
      end: string
   }

   export function FocusHours() {
      const [focusHours, setFocusHours] = useState<FocusHourRange[]>([])

      const addFocusHour = () => {
         setFocusHours([
            ...focusHours,
            {
               id: Math.random().toString(36).substring(7),
               start: "",
               end: "",
            },
         ])
      }

      const removeFocusHour = (id: string) => {
         setFocusHours(focusHours.filter((hour) => hour.id !== id))
      }

      const updateFocusHour = (id: string, field: "start" | "end", value: string) => {
         setFocusHours(focusHours.map((hour) => (hour.id === id ? { ...hour, [field]: value } : hour)))
      }

      return (
         <div className="space-y-4">
            <div className="space-y-3">
               {focusHours.map((hour) => (
                  <div key={hour.id} className="flex items-center gap-2">
                     <div className="grid flex-1 grid-cols-[1fr,auto,1fr] items-center gap-3">
                        <input
                           type="time"
                           value={hour.start}
                           onChange={(e) => updateFocusHour(hour.id, "start", e.target.value)}
                           className="rounded border px-3 py-2 text-sm"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                           type="time"
                           value={hour.end}
                           onChange={(e) => updateFocusHour(hour.id, "end", e.target.value)}
                           className="rounded border px-3 py-2 text-sm"
                        />
                     </div>
                     <button
                        onClick={() => removeFocusHour(hour.id)}
                        className="rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-600"
                     >
                        <X size={18} />
                     </button>
                  </div>
               ))}
            </div>

            <button
               onClick={addFocusHour}
               className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
               <Plus size={16} />
               Add Focus Hours
            </button>

            {focusHours.length === 0 && (
               <div className="text-sm italic text-gray-400">No focus hours defined</div>
            )}
         </div>
      )
   }

   type Rule = {
      id: string
      condition: string
   }

   type RuleSection = {
      id: string
      name: string
      rules: Rule[]
   }

   export function PriorityRules() {
      const user = useUser()
      const [sections, setSections] = useState<RuleSection[]>(
         user?.data.preferences.inbox.priorities.map((priority) => ({
            id: priority.toLowerCase(),
            name: priority,
            rules:
               user?.data.preferences.inbox.priority_rules.map((rule, index) => ({
                  id: index.toString(),
                  condition: rule,
               })) || [],
         })) || [
            { id: "low", name: "Low Priority", rules: [] },
            { id: "medium", name: "Medium Priority", rules: [] },
            { id: "high", name: "High Priority", rules: [] },
         ]
      )

      const addRule = (sectionId: string) => {
         setSections(
            sections.map((section) => {
               if (section.id === sectionId) {
                  return {
                     ...section,
                     rules: [
                        ...section.rules,
                        {
                           id: Math.random().toString(36).substring(7),
                           condition: "",
                        },
                     ],
                  }
               }
               return section
            })
         )
      }

      const removeRule = (sectionId: string, ruleId: string) => {
         setSections(
            sections.map((section) => {
               if (section.id === sectionId) {
                  return {
                     ...section,
                     rules: section.rules.filter((rule) => rule.id !== ruleId),
                  }
               }
               return section
            })
         )
      }

      const updateRule = (sectionId: string, ruleId: string, condition: string) => {
         setSections(
            sections.map((section) => {
               if (section.id === sectionId) {
                  return {
                     ...section,
                     rules: section.rules.map((rule) => (rule.id === ruleId ? { ...rule, condition } : rule)),
                  }
               }
               return section
            })
         )
      }

      return (
         <div className="space-y-6">
            {sections.map((section) => (
               <div key={section.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                     <div className="text-sm font-medium">{section.name}</div>
                     <button
                        onClick={() => addRule(section.id)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                     >
                        <Plus size={16} />
                        Add Rule
                     </button>
                  </div>

                  <div className="space-y-2">
                     {section.rules.map((rule) => (
                        <div key={rule.id} className="flex items-center gap-2">
                           <input
                              type="text"
                              value={rule.condition}
                              onChange={(e) => updateRule(section.id, rule.id, e.target.value)}
                              placeholder="Enter rule condition..."
                              className="flex-1 rounded border px-3 py-2 text-sm"
                           />
                           <button
                              onClick={() => removeRule(section.id, rule.id)}
                              className="rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-600"
                           >
                              <X size={18} />
                           </button>
                        </div>
                     ))}

                     {section.rules.length === 0 && (
                        <div className="text-sm italic text-gray-400">No rules defined</div>
                     )}
                  </div>
               </div>
            ))}
         </div>
      )
   }

   export function CategoryRules() {
      const user = useUser()
      const [sections, setSections] = useState<RuleSection[]>(
         user?.data.preferences.inbox.categories.map((category) => ({
            id: category.toLowerCase(),
            name: category,
            rules:
               user?.data.preferences.inbox.category_rules.map((rule, index) => ({
                  id: index.toString(),
                  condition: rule,
               })) || [],
         })) || [
            { id: "work", name: "Work", rules: [] },
            { id: "personal", name: "Personal", rules: [] },
            { id: "finance", name: "Finance", rules: [] },
         ]
      )

      const addRule = (sectionId: string) => {
         setSections(
            sections.map((section) => {
               if (section.id === sectionId) {
                  return {
                     ...section,
                     rules: [
                        ...section.rules,
                        {
                           id: Math.random().toString(36).substring(7),
                           condition: "",
                        },
                     ],
                  }
               }
               return section
            })
         )
      }

      const removeRule = (sectionId: string, ruleId: string) => {
         setSections(
            sections.map((section) => {
               if (section.id === sectionId) {
                  return {
                     ...section,
                     rules: section.rules.filter((rule) => rule.id !== ruleId),
                  }
               }
               return section
            })
         )
      }

      const updateRule = (sectionId: string, ruleId: string, condition: string) => {
         setSections(
            sections.map((section) => {
               if (section.id === sectionId) {
                  return {
                     ...section,
                     rules: section.rules.map((rule) => (rule.id === ruleId ? { ...rule, condition } : rule)),
                  }
               }
               return section
            })
         )
      }

      return (
         <div className="space-y-6">
            {sections.map((section) => (
               <div key={section.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                     <div className="text-sm font-medium">{section.name}</div>
                     <button
                        onClick={() => addRule(section.id)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                     >
                        <Plus size={16} />
                        Add Rule
                     </button>
                  </div>

                  <div className="space-y-2">
                     {section.rules.map((rule) => (
                        <div key={rule.id} className="flex items-center gap-2">
                           <input
                              type="text"
                              value={rule.condition}
                              onChange={(e) => updateRule(section.id, rule.id, e.target.value)}
                              placeholder="Enter rule condition..."
                              className="flex-1 rounded border px-3 py-2 text-sm"
                           />
                           <button
                              onClick={() => removeRule(section.id, rule.id)}
                              className="rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-600"
                           >
                              <X size={18} />
                           </button>
                        </div>
                     ))}

                     {section.rules.length === 0 && (
                        <div className="text-sm italic text-gray-400">No rules defined</div>
                     )}
                  </div>
               </div>
            ))}
         </div>
      )
   }

   export function LabelRules() {
      const user = useUser()
      const [sections, setSections] = useState<RuleSection[]>(
         user?.data.preferences.inbox.labels.map((label) => ({
            id: label.toLowerCase(),
            name: label,
            rules:
               user?.data.preferences.inbox.label_rules.map((rule, index) => ({
                  id: index.toString(),
                  condition: rule,
               })) || [],
         })) || [
            { id: "important", name: "Important", rules: [] },
            { id: "urgent", name: "Urgent", rules: [] },
            { id: "follow-up", name: "Follow Up", rules: [] },
         ]
      )

      const addRule = (sectionId: string) => {
         setSections(
            sections.map((section) => {
               if (section.id === sectionId) {
                  return {
                     ...section,
                     rules: [
                        ...section.rules,
                        {
                           id: Math.random().toString(36).substring(7),
                           condition: "",
                        },
                     ],
                  }
               }
               return section
            })
         )
      }

      const removeRule = (sectionId: string, ruleId: string) => {
         setSections(
            sections.map((section) => {
               if (section.id === sectionId) {
                  return {
                     ...section,
                     rules: section.rules.filter((rule) => rule.id !== ruleId),
                  }
               }
               return section
            })
         )
      }

      const updateRule = (sectionId: string, ruleId: string, condition: string) => {
         setSections(
            sections.map((section) => {
               if (section.id === sectionId) {
                  return {
                     ...section,
                     rules: section.rules.map((rule) => (rule.id === ruleId ? { ...rule, condition } : rule)),
                  }
               }
               return section
            })
         )
      }

      return (
         <div className="space-y-6">
            {sections.map((section) => (
               <div key={section.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                     <div className="text-sm font-medium">{section.name}</div>
                     <button
                        onClick={() => addRule(section.id)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                     >
                        <Plus size={16} />
                        Add Rule
                     </button>
                  </div>

                  <div className="space-y-2">
                     {section.rules.map((rule) => (
                        <div key={rule.id} className="flex items-center gap-2">
                           <input
                              type="text"
                              value={rule.condition}
                              onChange={(e) => updateRule(section.id, rule.id, e.target.value)}
                              placeholder="Enter rule condition..."
                              className="flex-1 rounded border px-3 py-2 text-sm"
                           />
                           <button
                              onClick={() => removeRule(section.id, rule.id)}
                              className="rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-600"
                           >
                              <X size={18} />
                           </button>
                        </div>
                     ))}

                     {section.rules.length === 0 && (
                        <div className="text-sm italic text-gray-400">No rules defined</div>
                     )}
                  </div>
               </div>
            ))}
         </div>
      )
   }

   export function AISettings() {
      const user = useUser()
      const [summaryModel, setSummaryModel] = useState<string>(user?.data.preferences.ai.model || "GPT 4")
      const [replyModel, setReplyModel] = useState<string>(user?.data.preferences.ai.model || "GPT 4")
      const [templateModel, setTemplateModel] = useState<string>(user?.data.preferences.ai.model || "GPT 4")

      return (
         <div className="space-y-4">
            <div className="flex flex-col">
               <label>AI Model for Summary</label>
               <select
                  value={summaryModel}
                  onChange={(e) => setSummaryModel(e.target.value)}
                  className="rounded border p-2"
               >
                  <option value="GPT 4">GPT 4</option>
                  <option value="Claude 3">Claude 3</option>
                  <option value="Sonnet">Sonnet</option>
               </select>
            </div>
            <div className="flex flex-col">
               <label>AI Model for Replying</label>
               <select
                  value={replyModel}
                  onChange={(e) => setReplyModel(e.target.value)}
                  className="rounded border p-2"
               >
                  <option value="GPT 4">GPT 4</option>
                  <option value="Claude 3">Claude 3</option>
                  <option value="Sonnet">Sonnet</option>
               </select>
            </div>
            <div className="flex flex-col">
               <label>AI Model for Template Generation</label>
               <select
                  value={templateModel}
                  onChange={(e) => setTemplateModel(e.target.value)}
                  className="rounded border p-2"
               >
                  <option value="GPT 4">GPT 4</option>
                  <option value="Claude 3">Claude 3</option>
                  <option value="Sonnet">Sonnet</option>
               </select>
            </div>
         </div>
      )
   }

   export function AccountSettings() {
      const handleGoogleAuth = async () => {
         const res = await (
            await fetch("https://swiftmail-api.web.app/auth/google/auth_url", {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
               },
            })
         ).json()
         window.open(res.url, "_blank")
      }

      const isUserAuth = useUser((x) => x?.credentials?.google_oauth)
      // if (isUserAuth)
      //    return (
      //       <div className="space-y-4">
      //          <div>Connected to Google Account</div>
      //       </div>
      //    )

      return (
         <div className="space-y-4">
            <button
               onClick={handleGoogleAuth}
               className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            >
               <Mail size={16} />
               Connect Google Account
            </button>
         </div>
      )
   }
}

export default function Settings() {
   const isOpen = useSettings()

   if (!isOpen) return null

   const handleSave = () => {
      console.log("Saving settings...")
      settingsStore.set(false)
   }

   return (
      <AnimatePresence>
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               transition={{ duration: 0.2 }}
               className="relative h-[80vh] w-[600px] overflow-hidden rounded-2xl bg-white shadow-xl"
            >
               <div className="sticky top-0 z-10 border-b bg-white px-6 py-4">
                  <div className="flex items-center justify-between">
                     <div className="text-2xl font-medium">Settings</div>
                     <div
                        onClick={() => settingsStore.set(false)}
                        className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
                     >
                        <X size={20} />
                     </div>
                  </div>
               </div>

               <div className="h-[calc(100%-140px)] overflow-auto p-6">
                  <div className="space-y-8">
                     <Components.Section title="Account">
                        <Components.AccountSettings />
                     </Components.Section>

                     <Components.Section title="Focus Hours">
                        <Components.FocusHours />
                     </Components.Section>

                     <Components.Section title="Category Rules">
                        <Components.CategoryRules />
                     </Components.Section>

                     <Components.Section title="Label Rules">
                        <Components.LabelRules />
                     </Components.Section>

                     <Components.Section title="Priority Rules">
                        <Components.PriorityRules />
                     </Components.Section>

                     <Components.Section title="AI Settings">
                        <Components.AISettings />
                     </Components.Section>
                  </div>
               </div>

               <div className="sticky bottom-0 border-t bg-white px-6 py-4">
                  <button
                     onClick={handleSave}
                     className="w-full rounded-lg bg-black py-2 text-white transition-colors hover:bg-black/90"
                  >
                     Save Changes
                  </button>
               </div>
            </motion.div>
         </div>
      </AnimatePresence>
   )
}
