import React, { useContext } from "react";
import { MainContext } from "../contexts/MainContext"
import { Link } from "react-router-dom";
import { Badge, Box, Image } from "@chakra-ui/core";
import { BsTrashFill } from 'react-icons/bs';


export default function FavoriteLaunchItem({ launch }) {
    const { toggleFavorite } = useContext(MainContext)
    
    return (
      <Box
        as={Link}
        to={`/launches/${launch.flight_number.toString()}`}
        boxShadow="md"
        borderWidth="1px"
        rounded="lg"
        overflow="hidden"
        position="relative"
        mb={2}
      >
        <Image
          src={
            launch.links.flickr_images[0]?.replace("_o.jpg", "_z.jpg") ??
            launch.links.mission_patch_small
          }
          alt={`${launch.mission_name} launch`}
          height={["50px", null, "75px"]}
          width="100%"
          objectFit="cover"
          objectPosition="bottom"
        />
  
        <Image
          position="absolute"
          top="5"
          right="5"
          src={launch.links.mission_patch_small}
          height="25px"
          objectFit="contain"
          objectPosition="bottom"
        />
  
        <Box p="2">
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
            
          </Box>
          <Box d="flex" alignItems="baseline" justifyContent="space-between">
          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
          >
            {launch.mission_name}
          </Box>
          <Box as="button">
             <BsTrashFill color="red" size="16px" onClick={(e) => toggleFavorite(e, launch.flight_number, 'launches')} />
          </Box>
          </Box>
        </Box>
      </Box>
    );
  }