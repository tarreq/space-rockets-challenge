import React, { useContext } from "react";
import { MainContext } from "../contexts/MainContext"
import { Badge, Box, Image, SimpleGrid, Text, Flex } from "@chakra-ui/core";
import { format as timeAgo } from "timeago.js";
import { Link } from "react-router-dom";
import { IoMdRocket } from 'react-icons/io'

import { formatDate } from "../utils/format-date";
import Error from "./error";
import Breadcrumbs from "./breadcrumbs";
import LoadMoreButton from "./load-more-button";
import FavoriteToggleButton from "./FavoriteToggleButton"



export default function Launches() {
  const { data, error, isValidating, setSize, size, PAGE_SIZE } = useContext(MainContext)

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Launches" }]}
      />
      <SimpleGrid m={[2, null, 6]} minChildWidth="350px" spacing="4">
        {error.launches && <Error />}
        {data.launches &&
          data.launches
            .flat()
            .map((launch) => (
              <LaunchItem launch={launch} key={launch.flight_number} />
            ))}
      </SimpleGrid>
      <LoadMoreButton
        loadMore={() => setSize(size + 1)}
        data={data.launches}
        pageSize={PAGE_SIZE}
        isLoadingMore={isValidating.launches}
      />
    </div>
  );
}

export function LaunchItem({ launch }) {
  const { favoriteLaunches, toggleFavorite, launchRocket } = useContext(MainContext)
  
  return (
    <Box
      as={Link}
      to={`/launches/${launch.flight_number.toString()}`}
      boxShadow="md"
      borderWidth="1px"
      rounded="lg"
      overflow="hidden"
      position="relative"
    >
      <Image
        src={
          launch.links.flickr_images[0]?.replace("_o.jpg", "_z.jpg") ??
          launch.links.mission_patch_small
        }
        alt={`${launch.mission_name} launch`}
        height={["200px", null, "300px"]}
        width="100%"
        objectFit="cover"
        objectPosition="bottom"
      />

      <Image
        position="absolute"
        top="5"
        right="5"
        src={launch.links.mission_patch_small}
        height="75px"
        objectFit="contain"
        objectPosition="bottom"
      />

      <Box p="6">
        <Box d="flex" alignItems="baseline" justifyContent="space-between">
          <Box d="flex">
          {launch.launch_success ? (
            <Badge px="2" variant="solid" variantColor="green">
              Successful
            </Badge>
          ) : (
            <Badge px="2" variant="solid" variantColor="red">
              Failed
            </Badge>
          )}
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            {launch.rocket.rocket_name} &bull; {launch.launch_site.site_name}
          </Box>
          </Box>
          <Box d="flex">
          <Box m={2} as="button" onClick={(e) => launchRocket(e, launch.launch_success)}
            style={{
              transform: launch.launch_success ? 'rotate(0deg)' : 'rotate(180deg)'
            }}
          >
            <IoMdRocket size="24px" />
          </Box>
            <FavoriteToggleButton 
            favorites={favoriteLaunches}
            id={launch.flight_number}
            onClick={(e) => toggleFavorite(e, launch.flight_number, 'launches')} 
          />
          </Box>
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {launch.mission_name}
        </Box>
        <Flex>
          <Text fontSize="sm">{formatDate(launch.launch_date_utc)} </Text>
          <Text color="gray.500" ml="2" fontSize="sm">
            {timeAgo(launch.launch_date_utc)}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}
