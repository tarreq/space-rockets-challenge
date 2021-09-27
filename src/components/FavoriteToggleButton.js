import React from 'react'
import { Box } from "@chakra-ui/core";
import { BsHeart, BsFillHeartFill } from 'react-icons/bs';

const FavoriteToggleButton = ({favorites, id, ...rest }) => {
    return (
        <Box as="button">
            {favorites && favorites.includes(id) ?
             <BsFillHeartFill color="red" size="24px" {...rest}/>
             :
             <BsHeart size="24px" {...rest}/>
            }
        </Box>
    )
}

export default FavoriteToggleButton
