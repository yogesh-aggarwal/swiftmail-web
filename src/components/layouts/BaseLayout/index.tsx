import Footer from "@components/common/Footer"
import Header from "@components/common/Header"

export default function BaseLayout(props: { children: React.ReactNode }) {
   return (
      <div className="grid grid-rows-[min-content,1fr] h-screen overflow-auto">
         <Header />
         <div className="h-full overflow-auto">
            {props.children}
            <Footer />
         </div>
      </div>
   )
}
