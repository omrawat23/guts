import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import Intro from "./pages/Intro";


export default function Layout() {
    return (
        <main className="dark-theme">
            <Header />
        </main>
    );
}
