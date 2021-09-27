import React, { useContext } from "react";
import { MainContext } from "../contexts/MainContext"
import { Badge, Box, SimpleGrid, Text } from "@chakra-ui/core";
import { Link } from "react-router-dom";
import FavoriteToggleButton from "./FavoriteToggleButton"

import Error from "./error";
import Breadcrumbs from "./breadcrumbs";
import LoadMoreButton from "./load-more-button";

export default function LaunchPads() {
  const { data, error, isValidating, setSize, size, PAGE_SIZE } = useContext(MainContext)


  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Launch Pads" }]}
      />
      <SimpleGrid m={[2, null, 6]} minChildWidth="350px" spacing="4">
        {error.launchPads && <Error />}
        {data.launchPads &&
          data.launchPads
            .flat()
            .map((launchPad) => (
              <LaunchPadItem key={launchPad.site_id} launchPad={launchPad} />
            ))}
      </SimpleGrid>
      <LoadMoreButton
        loadMore={() => setSize(size + 1)}
        data={data.launchPads}
        pageSize={PAGE_SIZE}
        isLoadingMore={isValidating.launchPads}
      />
    </div>
  );
}

function LaunchPadItem({ launchPad }) {
  const { favoriteLaunchPads, toggleFavorite } = useContext(MainContext)

  return (
    <Box
      as={Link}
      to={`/launch-pads/${launchPad.site_id}`}
      boxShadow="md"
      borderWidth="1px"
      rounded="lg"
      overflow="hidden"
      position="relative"
    >
      <Box p="6">
        <Box d="flex" alignItems="baseline" justifyContent="space-between">
          {launchPad.status === "active" ? (
            <Badge px="2" variant="solid" variantColor="green">
              Active
            </Badge>
          ) : (
            <Badge px="2" variant="solid" variantColor="red">
              Retired
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
            {launchPad.attempted_launches} attempted &bull;{" "}
            {launchPad.successful_launches} succeeded
          </Box>
          <FavoriteToggleButton 
            favorites={favoriteLaunchPads}
            id={launchPad.site_id}
            onClick={(e) => toggleFavorite(e, launchPad.site_id, 'launchPads')} 
          />
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {launchPad.name}
        </Box>
        <Text color="gray.500" fontSize="sm">
          {launchPad.vehicles_launched.join(", ")}
        </Text>
      </Box>
    </Box>
  );
}
