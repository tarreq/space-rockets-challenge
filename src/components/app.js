import React, { useRef, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { 
  Flex, 
  Text, 
  Box, 
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

export default function App() {
  const [favoriteLaunches, setFavoriteLaunches] = useState([])
  
  const handleAddFavorite = (e, flight_number) => {
    e.preventDefault();
    if(!favoriteLaunches.includes(flight_number)) setFavoriteLaunches([...favoriteLaunches, flight_number])
    
  }

  useEffect(() => {
    if(localStorage.spaceXLaunches && JSON.parse(localStorage.spaceXLaunches).length > 0) {
      const itemsInStorage = JSON.parse(localStorage.spaceXLaunches) // array
      localStorage.spaceXLaunches = JSON.stringify([...new Set([...favoriteLaunches, ...itemsInStorage])])
    } 
    else localStorage.setItem('spaceXLaunches', JSON.stringify(favoriteLaunches))
  }, [favoriteLaunches])

  useEffect(() => {
    if(JSON.parse(localStorage.spaceXLaunches).length > 0) {
      setFavoriteLaunches(JSON.parse(localStorage.spaceXLaunches))
    }
  }, [])

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/launches" element={<Launches handleAddFavorite={handleAddFavorite} favoriteLaunches={favoriteLaunches} />} />
        <Route path="/launches/:launchId" element={<Launch />} />
        <Route path="/launch-pads" element={<LaunchPads />} />
        <Route path="/launch-pads/:launchPadId" element={<LaunchPad />} />
      </Routes>
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

