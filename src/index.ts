import { server } from './server/Server';

server.listen(process.env.PORT || 3000, () => 
    console.log(`Plex Server Running on port ${process.env.PORT || 3000} ! ✅`))
