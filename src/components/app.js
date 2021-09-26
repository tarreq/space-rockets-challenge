import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { 
  Flex, 
  Text, 
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input
  } from "@chakra-ui/core";

import Launches from "./launches";
import Launch from "./launch";
import Home from "./home";
import LaunchPads from "./launch-pads";
import LaunchPad from "./launch-pad";
import { MainContext } from "../contexts/MainContext"

export default function App() {
  const [favoriteLaunches, setFavoriteLaunches] = useState([])
  const [favoritesLoaded, setFavoritesLoaded] = useState(false)
  
  
  const toggleFavorite = (e, flight_number) => {
    e.preventDefault();
    if(!favoriteLaunches.includes(flight_number)) {
      setFavoriteLaunches([...favoriteLaunches, flight_number])
    }
    else {
      setFavoriteLaunches(favoriteLaunches.filter(favorited_flight_number => favorited_flight_number !== flight_number ))
    } 
  }

  useEffect(() => {
    if(favoritesLoaded) localStorage.setItem('spaceXLaunches', JSON.stringify(favoriteLaunches))
  }, [favoriteLaunches, favoritesLoaded])

  useEffect(() => {
    if(JSON.parse(localStorage.spaceXLaunches).length > 0) {
      setFavoriteLaunches(JSON.parse(localStorage.spaceXLaunches))
    }
    setFavoritesLoaded(true)
  }, [])

  const store = {
    favoriteLaunches,
    toggleFavorite
  }

  return (
    <div>
      <MainContext.Provider value={store}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/launches" element={<Launches />} />
          <Route path="/launches/:launchId" element={<Launch />} />
          <Route path="/launch-pads" element={<LaunchPads />} />
          <Route path="/launch-pads/:launchPadId" element={<LaunchPad />} />
        </Routes>
      </MainContext.Provider>
    </div>
  );
}

function NavBar() {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="6"
      bg="gray.800"
      color="white"
    >
      <Text
        fontFamily="mono"
        letterSpacing="2px"
        fontWeight="bold"
        fontSize="lg"
      >
        ¡SPACE·R0CKETS!
      </Text>
      <FavoritesDrawer />
    </Flex>
  );
}

function FavoritesDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  return (
    <>
      <Button ref={btnRef} bg="gray.600" onClick={onOpen}>
        Favorites
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Favorites</DrawerHeader>

          <DrawerBody>
            <Input placeholder="Type here..." />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" ml={3} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

