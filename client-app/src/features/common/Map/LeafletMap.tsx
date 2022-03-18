import React from "react"
import "leaflet/dist/leaflet.css";
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';


import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon( {
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,

} );

L.Marker.prototype.options.icon = DefaultIcon;

interface IMapping {
    latitude ?: number;
    longitude ?: number;
    tileLayer ?: {
        url : string;
        attribution : string;
    };
    zoom ?: number;
    scrollWheelZoom ?: boolean;
    draggable ?: boolean;
    height ?: string;
    width ?: string;
    markerPopup ?: string;
    showMarker ?: boolean;
}

const defaultProps : any = {
    latitude: 32.4207423,
    longitude: 53.6830157,
    tileLayer: {
        url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.osm.org/copyright">OpenStreetMap</a>'
    },
    zoom: 6,
    scrollWheelZoom: true,
    draggable: true,
    height: "calc(100vh - 5.5rem)",
    width: "100%",
    markerPopup: "",
    showMarker: false,
};

const LeafletMap : React.FC<IMapping> = ( {
    latitude,
    longitude,
    tileLayer,
    zoom,
    scrollWheelZoom,
    draggable,
    height,
    width,
    markerPopup,
    showMarker,
} ) => {

    return (
        <Map
            center={ [ latitude!, longitude! ] }
            zoom={ zoom }
            scrollWheelZoom={ scrollWheelZoom }
            draggable={ draggable }
            style={ { width: width, height: height } }>
            
            <TileLayer
                attribution={ tileLayer!.attribution }
                url={ tileLayer!.url }
            />

            {showMarker &&
                <Marker position={ [ latitude!, longitude! ] } >
                    <Popup>{ markerPopup }</Popup>
                </Marker>
            }


        </Map >
    );
};

LeafletMap.defaultProps = defaultProps;

export default LeafletMap;

