import httpService from "./httpService";
import {allSitesURL} from "../config.json"

export  function getAllSites() {
    return httpService.get(allSitesURL)
}
