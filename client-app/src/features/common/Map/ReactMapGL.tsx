import React, { Fragment, useEffect, useState } from 'react';
import { MdLocationOn } from "react-icons/md"
import MapGl, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { setRTLTextPlugin } from "mapbox-gl";

setRTLTextPlugin( "/assets/react-map-gl-rtl/mapbox-gl-rtl-text.js", () => { } );




interface IProps {
    latitude : number;
    longitude : number;
    zoom ?: number;
}

const ReactMapGl : React.FC<IProps> = ( { latitude, longitude, zoom } ) => {

    const [ viewport, setViewport ] = useState( {
        latitude: latitude ? latitude : 35.6892,
        longitude: longitude ? longitude : 51.3890,
        zoom: zoom ? zoom : 11
    } );

    useEffect( () => { }, [] )


    return (
        <MapGl
            { ...viewport }
            width="100vw"
            height="calc(100vh - 5rem)"
            onViewportChange={ ( viewport : any ) => setViewport( viewport ) }
            mapboxApiAccessToken="pk.eyJ1IjoicmV6YWVzbWFlaWxpIiwiYSI6ImNrdWYzemc0czBpaDUyd252a3ZrN2Iwd3oifQ.mvMPzUy8NlabAcsgOXV1Ug"
            mapStyle="mapbox://styles/rezaesmaeili/ckufci3fb6aq818mrz4zs0zvs"

        >

            <Marker key={ 1 } latitude={ latitude } longitude={ longitude } >   <MdLocationOn size={ 50 } color="#e84118" /> </Marker>

        </MapGl>

    );
}

export default ReactMapGl;