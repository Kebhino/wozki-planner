import imageZL from "@/assets/logaSlider/znanylekarz-blue.webp"
import imageAbart from "@/assets/logaSlider/abartlogo-blue.webp"
import imageAps from "@/assets/logaSlider/aps-logo-blue.webp"
import imageCuprum from "@/assets/logaSlider/cuprum-logo-blue.webp"
import imageInstaGlass from "@/assets/logaSlider/instaglass-logo-blue.webp"
import imageInstaCode from "@/assets//logo-nowe.webp"

export interface Project {
    title: string;    
    description: string;
    urlImage: string;
    id: string;
}

const projectList = [{
    title: "ZnanyLekarz",
    description: "Nasz największy sukces to ZnanyLekarz.pl, który został w całości zaprojektowany i wykonany przez nas, gdy pojawił się pomysł na taki serwis. Nasz projekt i wykonanie okazało się wielkim sukcesem — serwis stał się bardzo popularny, a po sprzedaży odniósł ogromny międzynarodowy sukces.",
    urlImage: imageZL,
    id: "znany-lekarz"

},
{
    title: "Abart",
    description: "Zinformatyzowaliśmy firmę ABART, obejmując naszym systemem każdy aspekt działalności — od automatycznych wycen, po śledzenie, rozliczanie i raportowanie całego procesu instalacji systemów LPG.",
    urlImage: imageAbart,
    id: "abart"
},
{
    title: "APS",
    description: "Zajmowaliśmy się także systemami kompleksowo zarządzającymi procesami windykacji — obsługa call center, wymiana danych osobowych z bankami, rozbudowane raportowanie (firmy: iCentrum S.A., APS Poland S.A.).",
    urlImage: imageAps,
    id: "aps"

},
{
    title: "Cuprum",
    description: "Dla KGHM CUPRUM przez lata przygotowywaliśmy dedykowane rozwiązania, które dbały o efektywną wymianę informacji w ramach tej firmy, przy jednoczesnym zapewnieniu odpowiedniej poufności.",
    urlImage: imageCuprum,
    id: "cuprum"
},
{
    title: "InstaGlass",
    description: "Mamy także doświadczenie w systemach zarządzania produkcją i montażami. Stworzyliśmy kompleksowe rozwiązanie dla firmy InstaGlas, umożliwiające precyzyjne śledzenie wszystkich kosztów projektów, w tym kosztów pracowniczych, oraz finalne raportowanie rentowności.",
    urlImage: imageInstaGlass,
    id: "instaglass"
},
{title: "InstaCode",
    description: "InstaCode to projekt stworzony z myślą o firmach potrzebujących niezawodnych rozwiązań IT. Od początku zaprojektowany i zbudowany przez nas z naciskiem na nowoczesny design, wydajność i skalowalność. Łączy w sobie aplikacje webowe, automatyzacje oraz integracje systemów, wspierając rozwój wielu branż.",
    urlImage: imageInstaCode,
    id: "instacode" 
}]; 

export default projectList;
