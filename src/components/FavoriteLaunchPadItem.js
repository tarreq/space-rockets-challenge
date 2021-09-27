import React, { useContext } from "react";
import { MainContext } from "../contexts/MainContext"
import { Link } from "react-router-dom";
import { Badge, Box, Text } from "@chakra-ui/core";
import { BsTrashFill } from 'react-icons/bs';


export default function FavoriteLaunchPadItem({ launchPad }) {
    const { toggleFavorite } = useContext(MainContext)
    
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
          <Box p="2">
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
            <Box d="flex" alignItems="baseline" justifyContent="space-between">
                <Text color="gray.500" fontSize="sm">
                {launchPad.vehicles_launched.join(", ")}
                </Text>
                <Box as="button">
                <BsTrashFill color="red" size="16px" onClick={(e) => toggleFavorite(e, launchPad.site_id, 'launchPads')} />
                </Box>
            </Box>
            
          </Box>
        </Box>
      );
  }