import '../styles/globals.css'

//internal import

import {NavBar} from "../components/ComponentIndex";



const nftmarket = ({Component, pageProps}) =>
    <div>
        <NavBar/>
        <Component {...pageProps} />
    </div>




export default nftmarket;