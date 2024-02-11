
import { useEffect, useState } from 'react';
import { Outlet } from "react-router-dom";

import { Button } from '../ui/button';
import NavItems from './NavItems';
import MobileNav from './MobileNav';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Header = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(currentScrollPos <= 100 || prevScrollPos > currentScrollPos);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos, visible]);

  const getCurrentPlayerQuery = useQuery({
    queryKey: ['currentPlayer'],
    queryFn: async () =>{
      try{
        const response = await axios.get('/api/v1/players/current-player')
        return response.data
      }
      catch(error){
      console.log("failed to load current player", error)
      }
    }
  }
  )


  return (
    <>
      <header
        className={`z-10 w-full bg-white border-b p-4 fixed top-0 transition-transform ${visible ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className="wrapper flex items-center justify-between">
          <div className="w-36">
            <img src="/assets/logo.png" width={80} height={38} alt="logo" />
          </div>

          <nav className="md:flex md:flex-between hidden w-full max-w-xl">
            <NavItems />
          </nav>

          <div className="flex w-32 justify-end gap-3">
            <Button asChild className="rounded-full" size="lg">
              <Link to="/register">{getCurrentPlayerQuery?.data ? getCurrentPlayerQuery.data?.data?.firstName : 'Login'} </Link>
            </Button>
            <MobileNav />
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default Header;
