export default function Topbar(props: { actions: { name: string; badge: string; onClick: () => any }[] }) {
   return (
      <header className="w-full">
         {props.actions.map((action) => (
            <div key={action.name} onClick={action.onClick}>
               <span>{action.name}</span>
               {action.badge && <span>{action.badge}</span>}
            </div>
         ))}
      </header>
   )
}
