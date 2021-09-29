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
  Heading,
  Image
  } from "@chakra-ui/core";

import { useSpaceXPaginated } from "../utils/use-space-x";

import Launches from "./launches";
import Launch from "./launch";
import Home from "./home";
import LaunchPads from "./launch-pads";
import LaunchPad from "./launch-pad";
import { MainContext } from "../contexts/MainContext"
import FavoriteLaunchItem from "./FavoriteLaunchItem";
import FavoriteLaunchPadItem from "./FavoriteLaunchPadItem";

import { useTransition, animated as a } from 'react-spring';

const PAGE_SIZE = 12;

export default function App() {
  const [favorites, setFavorites] = useState({launches: [], launchPads: []})
  const [favoritesLoaded, setFavoritesLoaded] = useState(false)
  const [rocketVisible, setRocketVisible] = useState(false)
  const [flyingRocketSuccess, setFlyingRocketSuccess] = useState(null)

  const successAudio = new Audio("rocket_sound.mp3");
  const failureAudio = new Audio("failure_sound.mp3");

  const transition = useTransition(rocketVisible, {
    from: {x: 0, y: flyingRocketSuccess ? 500 : -900, opacity: flyingRocketSuccess ? .3 : 1},
    enter: {x: 0, y: flyingRocketSuccess ? -900 : 500, opacity: flyingRocketSuccess ? 1 : .3},
    config: {duration : 1500},
    onRest: () => setRocketVisible(false),
    leave: {}
  })

  const launchRocket = (e, success) => {
    e.stopPropagation()
    e.preventDefault()
    setFlyingRocketSuccess(success)
    success ?  successAudio.play() : failureAudio.play()
    setRocketVisible(true)
  }

  const { data: launchesData, error: launchesDataError, isValidating: isValidatingLaunches, setSize, size } = useSpaceXPaginated(
    "/launches/past",
    {
      limit: PAGE_SIZE,
      order: "desc",
      sort: "launch_date_utc",
    }
  );

  const { data: launchPadsData, error: launchPadsDataError, isValidating: isValidatingLaunchPads } = useSpaceXPaginated(
    "/launchpads",
    {
      limit: PAGE_SIZE,
    }
  );
  
  const toggleFavorite = (e, id, type) => {
    e.preventDefault();
    e.stopPropagation();
    if(!favorites[type].includes(id)) {
      setFavorites({...favorites, [type]: [...favorites[type], id]});
    }
    else {
      setFavorites({...favorites, [type]:favorites[type]
        .filter(favorited_flight_number => favorited_flight_number !== id )});
    } 
  }

  useEffect(() => {
    if(favoritesLoaded) {
      localStorage.setItem('spaceXLaunches', JSON.stringify(favorites['launches']));
      localStorage.setItem('spaceXLaunchPads', JSON.stringify(favorites['launchPads']));
    }
  }, [favorites, favoritesLoaded])

  useEffect(() => {
    setFavorites({
      launches: localStorage.spaceXLaunches && JSON.parse(localStorage.spaceXLaunches).length > 0 
      ? JSON.parse(localStorage.spaceXLaunches)
      : favorites['launches'],
      launchPads: localStorage.spaceXLaunchPads && JSON.parse(localStorage.spaceXLaunchPads).length > 0
      ? JSON.parse(localStorage.spaceXLaunchPads)
      : favorites['launchPads']
    });
    setFavoritesLoaded(true);
  }, [])

  const store = {
    favoriteLaunches: favorites['launches'],
    favoriteLaunchPads: favorites['launchPads'],
    toggleFavorite,
    launchRocket,
    data: {launches: launchesData, launchPads: launchPadsData}, 
    error: {launches: launchesDataError, launchPads: launchPadsDataError}, 
    isValidating: {launches: isValidatingLaunches, launchPads: isValidatingLaunchPads}, 
    setSize, 
    size,
    PAGE_SIZE
  }

  return (
    <div>
      <MainContext.Provider value={store}>
        <NavBar />
        {transition ((style, item) =>
          item ? 
          <a.div style={{
            position: 'fixed',
            display: 'felx',
            left: '50%',
            top: '70%',
            zIndex: 9,
            width: '100px',
            height: '100px',
            margin: '0 auto',
            transform: flyingRocketSuccess ? 'rotate(0deg)' : 'rotate(180deg)',
            ...style
          }}>
            <Image
            top="5"
            right="5"
            src="rocket.png"
            height="200px"
            objectFit="contain"
            objectPosition="bottom"
          />
            </a.div>
          : ''
        )}
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
  const { data, favoriteLaunches, favoriteLaunchPads } = useContext(MainContext)

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
              {favoriteLaunches && favoriteLaunches.length > 0 &&
                <Heading fontSize={["md", "xl"]} py="2">
                  Launches
                </Heading>}
              {/* Launches favorites */}
              {data.launches &&
                data.launches
                  .flat()
                  .filter((launch) => favoriteLaunches.includes(launch.flight_number))
                  .map((launch) => (
                    <FavoriteLaunchItem launch={launch} key={launch.flight_number} />
                  ))}
              {favoriteLaunchPads && favoriteLaunchPads.length > 0 &&
                <Heading fontSize={["md", "xl"]} py="2">
                  Launch Pads
                </Heading>}
              {/* LaunchPads favorites */}
              {data.launchPads &&
                data.launchPads
                  .flat()
                  .filter((launchPad) => favoriteLaunchPads.includes(launchPad.site_id))
                  .map((launchPad) => (
                    <FavoriteLaunchPadItem launchPad={launchPad} key={launchPad.site_id} />
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

