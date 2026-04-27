import { useState } from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import MenuBar from './components/MenuBar';
import { Routes, Route } from 'react-router-dom';
import Teams from './pages/Teams';
import { Drawer } from './components/Drawer';




export default function App() {

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">

      <header className='mt-2 fixed top-0 z-50'>
      <MenuBar onProfileClick={() => 
        setIsProfileOpen(true)}/>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/teams" element={<Teams/>}/>
        </Routes>

        <Drawer open={isProfileOpen} onOpenChange={setIsProfileOpen} side="right"/>
        
     </main>
    </div>
  )
}

