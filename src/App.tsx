import { useState } from "react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HomePage } from "./pages/HomePage";
import { useDarkMode } from "./hooks/useDarkMode";

function App() {
  const { isDark, toggle } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
      <Header
        isDark={isDark}
        onToggleDark={toggle}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <HomePage searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </div>

      <Footer />
    </div>
  );
}

export default App;
