import React, { useState, useEffect, useContext } from "react";
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
  Stack,
  Heading
  } from "@chakra-ui/core";

import { useSpaceXPaginated } from "../utils/use-space-x";

import Launches from "./launches";
import Launch from "./launch";
import Home from "./home";
import LaunchPads from "./launch-pads";
import LaunchPad from "./launch-pad";
import { MainContext } from "../contexts/MainContext"
import FavoriteLaunchItem from "./FavoriteLaunchItem";

const PAGE_SIZE = 12;

export default function App() {
  const [favoriteLaunches, setFavoriteLaunches] = useState([])
  const [favoriteLaunchePads, setFavoriteLaunchePads] = useState([])
  const [favoritesLoaded, setFavoritesLoaded] = useState(false)

  const { data, error, isValidating, setSize, size } = useSpaceXPaginated(
    "/launches/past",
    {
      limit: PAGE_SIZE,
      order: "desc",
      sort: "launch_date_utc",
    }
  );
  console.log(data, error);
  
  
  const toggleFavorite = (e, flight_number) => {
    e.preventDefault();
    e.stopPropagation();
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
    toggleFavorite,
    data, 
    error, 
    isValidating, 
    setSize, 
    size,
    PAGE_SIZE
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
  const { data, favoriteLaunches } = useContext(MainContext)

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
        scrollBehavior="inside"
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Flex align="center" justify="center">
              Favorites
            </Flex>
          </DrawerHeader>
          

          <DrawerBody>
            <Stack>
            <Heading
              display="inline"
              fontSize={["md", "xl"]}
              // px="2"
              py="2"
              borderRadius="lg"
            >
              Launches
            </Heading>
              {data &&
              data
                .flat()
                .filter((launch) => favoriteLaunches.includes(launch.flight_number))
                .map((launch) => (
                  <FavoriteLaunchItem launch={launch} key={launch.flight_number} />
                ))}
            </Stack>
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

