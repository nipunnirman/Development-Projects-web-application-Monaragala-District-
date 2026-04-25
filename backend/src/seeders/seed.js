/**
 * Seed script – run with:  npm run seed
 *
 * Populates:
 *   - 1 district  : Monaragala
 *   - 5 DS Divisions for Monaragala
 *   - GN Divisions for each DS Division
 *   - 1 default admin user
 *   - 6 sample projects
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import District from '../models/District.js';
import DsDivision from '../models/DsDivision.js';
import GnDivision from '../models/GnDivision.js';
import Project from '../models/Project.js';
import Admin from '../models/Admin.js';

// ─── Location Data ─────────────────────────────────────────────────────────────

const districtData = {
  name: 'Monaragala',
  nameSi: 'මොනරාගල',
  province: 'Uva',
};

const dsDivisions = [
  { name: 'Monaragala',     nameSi: 'මොනරාගල'     },
  { name: 'Bibile',         nameSi: 'බිබිල'         },
  { name: 'Wellawaya',      nameSi: 'වැල්ලවාය'      },
  { name: 'Siyambalanduwa', nameSi: 'සියඹලාන්ඩුව' },
  { name: 'Kataragama',     nameSi: 'කතරගම'        },
  { name: 'Badalkumbura',   nameSi: 'බඩල්කුඹුර'   },
  { name: 'Medagama',       nameSi: 'මැදගම'       },
  { name: 'Madulla',        nameSi: 'මඩුල්ල'        },
  { name: 'Buttala',        nameSi: 'බුත්තල'        },
  { name: 'Thanamalwila',   nameSi: 'තණමල්විල'      },
  { name: 'Sewanagala',     nameSi: 'සෙවනගල'        },
];

const gnDivisionsByDs = {
  Monaragala: [
    { name: 'Tenwatta', nameSi: 'ටැංවත්ත' },
    { name: 'Nakkala', nameSi: 'නක්කල' },
    { name: 'Hindikiwula', nameSi: 'හිඳිකිවුල' },
    { name: 'Guruhela', nameSi: 'ගුරුහෙල' },
    { name: 'Batugammana', nameSi: 'බටුගම්මන' },
    { name: 'Debeddekiwula', nameSi: 'දෙබැද්දේකිවුල' },
    { name: 'Rattanapitiya', nameSi: 'රත්තනපිටිය' },
    { name: 'Magandanamulla', nameSi: 'මාගන්දනමුල්ල' },
    { name: 'Viharamulla', nameSi: 'විහාරමුල්ල' },
    { name: 'Monaragala', nameSi: 'මොනරාගල' },
    { name: 'Weliyaya', nameSi: 'වැලියාය' },
    { name: 'Aliyawatta', nameSi: 'අලියාවත්ත' },
    { name: 'Muppane', nameSi: 'මුප්පනේ' },
    { name: 'Hulandawa', nameSi: 'හුලංදාව' },
    { name: 'Maduruketiya', nameSi: 'මදුරුකැටිය' },
    { name: 'Horombuwa', nameSi: 'හොරොම්බුව' },
    { name: 'Kumbukkana', nameSi: 'කුඹුක්කන' },
    { name: 'Hulandawa Dakuna', nameSi: 'හුලංදාව දකුණ' },
    { name: 'Hulandawa Wama', nameSi: 'හුලංදාව වම' },
    { name: 'Bohitiya', nameSi: 'බෝහිටිය' },
    { name: 'Kolonwinna', nameSi: 'කොලොන්වින්න' },
    { name: 'Kawudawa', nameSi: 'කවුඩාව' },
    { name: 'Weheragala', nameSi: 'වෙහෙරගල' },
    { name: 'Kahambana', nameSi: 'කහම්බාන' },
    { name: 'Marawa', nameSi: 'මාරාව' },
    { name: 'Thenagallanda', nameSi: 'තෙනගල්ලන්ද' },
  ],
  Bibile: [
    { name: 'Radaliyadda', nameSi: 'රදලියද්ද' },
    { name: 'Ambagolla', nameSi: 'අඹගොල්ල' },
    { name: 'Kanaweegalla', nameSi: 'කණවේගල්ල' },
    { name: 'Bokagonna', nameSi: 'බොකාගොන්න' },
    { name: 'Nilgala', nameSi: 'නිල්ගල' },
    { name: 'Bulupitiya', nameSi: 'බුළුපිටිය' },
    { name: 'Urawula', nameSi: 'ඌරාවුල' },
    { name: 'Karandugala', nameSi: 'කරාඬුගල' },
    { name: 'Pitakumbura', nameSi: 'පිටකුඹුර' },
    { name: 'Hamapola', nameSi: 'හාමාපොල' },
    { name: 'Thotillaketiya', nameSi: 'තොටිල්ලකැටිය' },
    { name: 'Nagala', nameSi: 'නාගල' },
    { name: 'Morathamulla', nameSi: 'මොරත්තමුල්ල' },
    { name: 'Kokunnawa', nameSi: 'කොකුන්නෑව' },
    { name: 'Bibile', nameSi: 'බිබිල' },
    { name: 'Lindakumbura', nameSi: 'ළිඳකුඹුර' },
    { name: 'Kawudella', nameSi: 'කවුඩැල්ල' },
    { name: 'Rathupasketiya', nameSi: 'රතුපස්කැටිය' },
    { name: 'Wegama Dakuna', nameSi: 'වෑගම දකුණ' },
    { name: 'Wegama Uthura', nameSi: 'වෑගම උතුර' },
    { name: 'Kehelaththawela', nameSi: 'කෙහෙල්අත්තාවෙල' },
    { name: 'Karagahawela Batahir', nameSi: 'කරගහවෙල බටහිර' },
    { name: 'Karagahawela Naganahira', nameSi: 'කරගහවෙල නැගෙනහිර' },
    { name: 'Mallahawa', nameSi: 'මල්ලැහැව' },
    { name: 'Badullagammana', nameSi: 'බදුල්ලගම්මන' },
    { name: 'Udamallahawa', nameSi: 'උඩමල්ලැහැව' },
    { name: 'Kuruwamba', nameSi: 'කුරුවාඹ' },
    { name: 'Hewalwela', nameSi: 'හෙවෙල්වෙල' },
    { name: 'Abelandha', nameSi: 'අබේලන්ද' },
    { name: 'Dodamgolla', nameSi: 'දොඩම්ගොල්ල' },
    { name: 'Eethanawaththa', nameSi: 'ඊතණවත්ත' },
    { name: 'Dehiyaththawela', nameSi: 'දෙහිඅත්තාවෙල' },
    { name: 'Kanulwela', nameSi: 'කණුල්වෙල' },
    { name: 'Medapitiya', nameSi: 'මැදපිටිය' },
    { name: 'Kotagama', nameSi: 'කොටගම' },
    { name: 'Moodiyala', nameSi: 'මූදියල' },
    { name: 'Thanayamgama', nameSi: 'තානායම්ගම' },
    { name: 'Yalkumbura', nameSi: 'යල්කුඹුර' },
    { name: 'Ussagala', nameSi: 'උස්සාගල' },
    { name: 'Egoda Kotagama', nameSi: 'එගොඩ කොටගම' },
  ],
  Wellawaya: [
    { name: 'Kurugama', nameSi: 'කුරුගම' },
    { name: 'Randeniya', nameSi: 'රන්දෙනිය' },
    { name: 'Siyambalaguna', nameSi: 'සියඹලාගුණය' },
    { name: 'Kotikambokka', nameSi: 'කොටිකම්බොක්ක' },
    { name: 'Galbokka', nameSi: 'ගල්බොක්ක' },
    { name: 'Dimbulamure', nameSi: 'දිඹුලාමුරේ' },
    { name: 'Anapallama', nameSi: 'ආනපල්ලම' },
    { name: 'Sudupanawela', nameSi: 'සුදුපානාවෙල' },
    { name: 'Warunagama', nameSi: 'වරුණගම' },
    { name: 'Wellawaya', nameSi: 'වැල්ලවාය' },
    { name: 'Yalabowa', nameSi: 'යාලබෝව' },
    { name: 'Buduruwagala', nameSi: 'බුදුරුවගල' },
    { name: 'Nugayaya', nameSi: 'නුගයාය' },
    { name: 'Neluwagala', nameSi: 'නෙළුවගල' },
    { name: 'Andagalayaya', nameSi: 'ආඳාගලයාය' },
    { name: 'Handapanagala', nameSi: 'හඳපානාගල' },
    { name: 'Pubuduwewa', nameSi: 'පුබුදුවැව' },
    { name: 'Randenigodayaya', nameSi: 'රන්දෙණිගොඩයාය' },
    { name: 'Siripuragama', nameSi: 'සිරිපුරගම' },
    { name: 'Weherayaya', nameSi: 'වෙහෙරයාය' },
    { name: 'Weherayaya Janapadaya', nameSi: 'වෙහෙරයාය ජනපදය' },
    { name: 'Thelulla', nameSi: 'තෙළුල්ල' },
    { name: 'Ethiliwewa', nameSi: 'ඇතිලිවැව' },
    { name: 'Mahaaragama', nameSi: 'මහආරගම' },
    { name: 'Thelulla Janapadaya', nameSi: 'තෙළුල්ල ජනපදය' },
    { name: 'Uwa Kuda Oya', nameSi: 'ඌව කුඩාඔය' },
    { name: 'Kithulkote', nameSi: 'කිතුල්කොටේ' },
    { name: 'Balaharuwa', nameSi: 'බලහරුව' },
    { name: 'Debaraara', nameSi: 'දෙබරආර' },
  ],
  Siyambalanduwa: [
    { name: 'Nape', nameSi: 'නාපේ' },
    { name: 'Meeyagala', nameSi: 'මීයාගල' },
    { name: 'Ambagahapitiya', nameSi: 'අඹගහපිටිය' },
    { name: 'Buddhama', nameSi: 'බුද්ධම' },
    { name: 'Waragama', nameSi: 'වරාගම' },
    { name: 'Pallewela', nameSi: 'පල්ලේවෙල' },
    { name: 'Govindupura', nameSi: 'ගොවිඳුපුර' },
    { name: 'Kotagoda', nameSi: 'කොටාගොඩ' },
    { name: 'Weragoda', nameSi: 'වේරගොඩ' },
    { name: 'Nawgala', nameSi: 'නැව්ගල' },
    { name: 'Barawaya', nameSi: 'බරවාය' },
    { name: 'Samanalabedda', nameSi: 'සමනලබැද්ද' },
    { name: 'Kuragammana', nameSi: 'කූරගම්මන' },
    { name: 'Kalugollayaya', nameSi: 'කළුගොල්ලයාය' },
    { name: 'Helamulla', nameSi: 'හෙලමුල්ල' },
    { name: 'Ruhunu Danawwa', nameSi: 'රුහුණු දනව්ව' },
    { name: 'Gal Amuna', nameSi: 'ගල් අමුණ' },
    { name: 'Yakkadurawa', nameSi: 'යක්කදුරාව' },
    { name: 'Muthukandiya', nameSi: 'මුතුකණ්ඩිය' },
    { name: 'Mahakalugolla', nameSi: 'මහකළුගොල්ල' },
    { name: 'Pallegama', nameSi: 'පල්ලේගම' },
    { name: 'Karambagoda', nameSi: 'කරඹගොඩ' },
    { name: 'Vijithapura', nameSi: 'විජිතපුර' },
    { name: 'Manabharana', nameSi: 'මනාභරණ' },
    { name: 'Siyambalanduwa', nameSi: 'සියඹලාණ්ඩුව' },
    { name: 'Madugama', nameSi: 'මඩුගම' },
    { name: 'Kiwuleyaya', nameSi: 'කිවුලෙයාය' },
    { name: 'Kodayana', nameSi: 'කොඩයාන' },
    { name: 'Guruhela', nameSi: 'ගුරුහෙල' },
    { name: 'Nugagahakiwula', nameSi: 'නුගගහකිවුල' },
    { name: 'Kotiyagoda', nameSi: 'කොටියාගොඩ' },
    { name: 'Indigasessa', nameSi: 'ඉඳිගස්ඇස්ස' },
    { name: 'Dombagahawela', nameSi: 'දොඹගහවෙල' },
    { name: 'Liyangolla', nameSi: 'ලියන්ගොල්ල' },
    { name: 'Beraliya Pola', nameSi: 'බෙරලිය පොල' },
    { name: 'Kimbulawela', nameSi: 'කිඹුලාවෙල' },
    { name: 'Athimale', nameSi: 'ඇතිමලේ' },
    { name: 'Wilaoya', nameSi: 'විලඔය' },
    { name: 'Pahathaarawa', nameSi: 'පහතආරාව' },
    { name: 'Athimale Janapadaya', nameSi: 'ඇතිමලේ ජනපදය' },
    { name: 'Minipura', nameSi: 'මිණිපුර' },
    { name: 'Gemunupura', nameSi: 'ගැමුණුපුර' },
    { name: 'Parakumpura', nameSi: 'පැරකුම්පුර' },
    { name: 'Siripura', nameSi: 'සිරිපුර' },
    { name: 'Vijayapura', nameSi: 'විජයපුර' },
    { name: 'Tissapura', nameSi: 'තිස්සපුර' },
    { name: 'Kotiyagala', nameSi: 'කොටියාගල' },
    { name: 'Wattegama', nameSi: 'වත්තේගම' },
  ],
  Kataragama: [
    { name: 'Karawile', nameSi: 'කරවිලේ' },
    { name: 'Sella Kataragama', nameSi: 'සෙල්ලකතරගම' },
    { name: 'Kataragama', nameSi: 'කතරගම' },
    { name: 'Kandasurindugama', nameSi: 'කඳසුරිඳුගම' },
    { name: 'Detagamuwa', nameSi: 'දෙටගමුව' },
  ],
  Badalkumbura: [
    { name: 'Waekumbura',         nameSi: 'වෑකුඹුර'         },
    { name: 'Maiyokkawatta',      nameSi: 'මයියොක්කාවත්ත'  },
    { name: 'Gadawila',           nameSi: 'ගැඩවිල'           },
    { name: 'Waradola',           nameSi: 'වරාදොල'           },
    { name: 'Maligatenna',        nameSi: 'මාලිගාතැන්න'     },
    { name: 'Pussellawa',         nameSi: 'පුස්සැල්ලෑව'     },
    { name: 'Madamagama',         nameSi: 'මඩමගම'            },
    { name: 'Madugahapattiya',    nameSi: 'මඩුගහපට්ටිය'     },
    { name: 'Karawila',           nameSi: 'කරවිල'            },
    { name: 'Karadagama',         nameSi: 'කරදගම'            },
    { name: 'Pallegama',          nameSi: 'පල්ලේගම'          },
    { name: 'Ella',               nameSi: 'ඇල්ල'             },
    { name: 'Mailagastenna',      nameSi: 'මයිලගස්තැන්න'    },
    { name: 'Yakurawa',           nameSi: 'යාකුරාව'          },
    { name: 'Madukotanarawa',     nameSi: 'මඩුකොටන්අරාව'   },
    { name: 'Therappuhuwa',       nameSi: 'තේරප්පහුව'        },
    { name: 'Thalawagama',        nameSi: 'තලාවගම'           },
    { name: 'Punsisigama',        nameSi: 'පුන්සිසිගම'      },
    { name: 'Muthukeliyawa',      nameSi: 'මුතුකෙලියාව'     },
    { name: 'Eththalamulla',      nameSi: 'ඇත්තලාමුල්ල'    },
    { name: 'Badalkumbura',       nameSi: 'බඩල්කුඹුර'       },
    { name: 'Wasipana',           nameSi: 'වාසිපන'           },
    { name: 'Madugasmulla',       nameSi: 'මඩුගස්මුල්ල'     },
    { name: 'Kalagahakiwula',     nameSi: 'කලගහකිවුල'       },
    { name: 'Alupotha',           nameSi: 'අලුපොත'           },
    { name: 'Ankada',             nameSi: 'අංකඩ'             },
    { name: 'Kotamuduna',         nameSi: 'කොටමුදුන'        },
    { name: 'Dewathura',          nameSi: 'දේවතුර'           },
    { name: 'Miyanakandura',      nameSi: 'මියනකඳුර'        },
    { name: 'Ethpattiya',         nameSi: 'ඇත්පට්ටිය'       },
    { name: 'Hingurukuduwa',      nameSi: 'හිඟුරුකඩුව'     },
    { name: 'Keliwessa',          nameSi: 'කැලිවැස්ස'        },
    { name: 'Ranugalla',          nameSi: 'රණූගල්ල'          },
    { name: 'Dambagahawela',      nameSi: 'දඹගහවෙල'         },
    { name: 'Athala',             nameSi: 'අතල'              },
    { name: 'Meegahayaya',        nameSi: 'මීගහයාය'          },
    { name: 'Bogahapelessa',      nameSi: 'බෝගහපැලැස්ස'     },
    { name: 'Naranwatta',         nameSi: 'නාරංවත්ත'        },
    { name: 'Katugahagalge',      nameSi: 'කටුගහගල්ගේ'      },
    { name: 'Lunugala Janapada',  nameSi: 'ලුණුගල ජනපදය'    },
    { name: 'Moratuwagama',       nameSi: 'මොරටුවගම'         },
  ],
  Medagama: [
    { name: 'Amunekandura', nameSi: 'අමුණේකඳුර' },
    { name: 'Rattanadeniya', nameSi: 'රත්තනදෙනිය' },
    { name: 'Keenagoda', nameSi: 'කීණගොඩ' },
    { name: 'Pubbara', nameSi: 'පුබ්බාර' },
    { name: 'Polgahapitiya', nameSi: 'පොල්ගහපිටිය' },
    { name: 'Bakinigahawela', nameSi: 'බකිණිගහවෙල' },
    { name: 'Thimbiriya', nameSi: 'තිඹිරිය' },
    { name: 'Thambana', nameSi: 'තඹාන' },
    { name: 'Mellagama', nameSi: 'මෑල්ලගම' },
    { name: 'Kendawinna', nameSi: 'කැන්දවින්න' },
    { name: 'Alana', nameSi: 'අලාන' },
    { name: 'Kinnarabowa', nameSi: 'කින්නරබෝව' },
    { name: 'Pitadeniya', nameSi: 'පිටදෙනිය' },
    { name: 'Nunnapurawa', nameSi: 'නන්නපුරාව' },
    { name: 'Senpathigama', nameSi: 'සෙන්පතිගම' },
    { name: 'Kalugahawadiya', nameSi: 'කලුගහවාඩිය' },
    { name: 'Dahamgama', nameSi: 'දහම්ගම' },
    { name: 'Kongolla', nameSi: 'කෝන්ගොල්ල' },
    { name: 'Kohukumbura', nameSi: 'කොහුකුඹුර' },
    { name: 'Bibilemulla', nameSi: 'බිබිලමුල්ල' },
    { name: 'Nugamura', nameSi: 'නුගාමුර' },
    { name: 'Diviyapola', nameSi: 'දිවියාපොල' },
    { name: 'Senapathiya', nameSi: 'සේනාපතිය' },
    { name: 'Monarawana', nameSi: 'මොනරවාන' },
    { name: 'Dahagoniya', nameSi: 'දහගෝනිය' },
    { name: 'Elhena', nameSi: 'ඇල්හේන' },
    { name: 'Ellekona', nameSi: 'ඇල්ලේකොණ' },
    { name: 'Kotabowa', nameSi: 'කොටබෝව' },
    { name: 'Godigamuwa', nameSi: 'ගොඩිගමුව' },
    { name: 'Aiwela', nameSi: 'අයිවෙල' },
    { name: 'Pothubandana', nameSi: 'පොතුබන්දන' },
    { name: 'Yakunnawa', nameSi: 'යකුන්නාව' },
    { name: 'Bandiyawa', nameSi: 'බැඳියාව' },
    { name: 'Medagama', nameSi: 'මැදගම' },
    { name: 'Ilukkumbura', nameSi: 'ඉලුක්කුඹුර' },
  ],
  Madulla: [
    { name: 'Iginiyagala', nameSi: 'ඉඟිණියාගල' },
    { name: 'Mullegama', nameSi: 'මුල්ලේගම' },
    { name: 'Nelliyadda', nameSi: 'නෙල්ලියද්ද' },
    { name: 'Galgamunwa', nameSi: 'ගල්ගමුව' },
    { name: 'Deliwa', nameSi: 'දැලිව' },
    { name: 'Thalkotayaya', nameSi: 'තල්කොටයාය' },
    { name: 'Panguwa', nameSi: 'පංගුව' },
    { name: 'Baduluwela', nameSi: 'බදුලුවෙල' },
    { name: 'Bandarawadiya', nameSi: 'බණ්ඩාරවාඩිය' },
    { name: 'Thampalawela', nameSi: 'තම්පලාවෙල' },
    { name: 'Aratugaswela', nameSi: 'අරාටුගස්වෙල' },
    { name: 'Galbokka', nameSi: 'ගල්බොක්ක' },
    { name: 'Makulla', nameSi: 'මකුල්ල' },
    { name: 'Magandana', nameSi: 'මාගන්දන' },
    { name: 'Namal Oya Janapadaya', nameSi: 'නාමල් ඔය ජනපදය' },
    { name: 'Ruwalwela', nameSi: 'රුවල්වෙල' },
    { name: 'Alpitiya', nameSi: 'අල්පිටිය' },
    { name: 'Watawanagama', nameSi: 'වටවනගම' },
    { name: 'Kottagala', nameSi: 'කෝට්ටගල' },
    { name: 'Ihawa', nameSi: 'ඉහාව' },
    { name: 'Gangodagama', nameSi: 'ගංගොඩගම' },
    { name: 'Kolladeniya', nameSi: 'කොල්ලදෙණිය' },
    { name: 'Mariarawa', nameSi: 'මාරිඅරාව' },
    { name: 'Ritigahawatta', nameSi: 'රිටිගහවත්ත' },
    { name: 'Polgahagama', nameSi: 'පොල්ගහගම' },
    { name: 'Alugalge', nameSi: 'අලුගල්ගේ' },
    { name: 'Neelawabedda', nameSi: 'නීලවබැද්ද' },
    { name: 'Kahagolla', nameSi: 'කහගොල්ල' },
    { name: 'Magandaoya Janapadaya', nameSi: 'මාගන්දාඔය ජනපදය' },
    { name: 'Gangodaarawa', nameSi: 'ගංගොඩඅරාව' },
    { name: 'Obbegoda', nameSi: 'ඔබ්බේගොඩ' },
    { name: 'Elle Kona', nameSi: 'ඇල්ලේ කොණ' },
    { name: 'Gonathalawa', nameSi: 'ගෝනතලාව' },
    { name: 'Dambagalla', nameSi: 'දඹගල්ල' },
    { name: 'Udumulla', nameSi: 'උඩුමුල්ල' },
    { name: 'Therela', nameSi: 'තැරෑල' },
    { name: 'Ilukklanda', nameSi: 'ඉළුක්ලන්ද' },
    { name: 'Pangura', nameSi: 'පඟුර' },
  ],
  Buttala: [
    { name: 'Pelwatta', nameSi: 'පැල්වත්ත' },
    { name: 'Horabokka', nameSi: 'හොරබොක්ක' },
    { name: 'Udaarawa', nameSi: 'උඩආරාව' },
    { name: 'Yudaganawa', nameSi: 'යුදගනාව' },
    { name: 'Unawatuna', nameSi: 'උනාවටුන' },
    { name: 'Udagama', nameSi: 'උඩගම' },
    { name: 'Mahagodayaya', nameSi: 'මහගොඩයාය' },
    { name: 'Dikyaya', nameSi: 'දික්යාය' },
    { name: 'Medagama', nameSi: 'මැදගම' },
    { name: 'Waguruwela', nameSi: 'වගුරුවෙල' },
    { name: 'Pettagamwela', nameSi: 'පෙට්ටගම්වෙල' },
    { name: 'Gaminipura', nameSi: 'ගාමිණිපුර' },
    { name: 'Galtammandiya', nameSi: 'ගල්ටැම්මණ්ඩිය' },
    { name: 'Maligawila', nameSi: 'මාලිගාවිල' },
    { name: 'Ulugala', nameSi: 'උළුගල' },
    { name: 'Minipuragama', nameSi: 'මිනිපුරගම' },
    { name: 'Okkampitiya', nameSi: 'ඔක්කම්පිටිය' },
    { name: 'Pahalagama', nameSi: 'පහලගම' },
    { name: 'Buruthagolla', nameSi: 'බුරුතගොල්ල' },
    { name: 'Gonaganara', nameSi: 'ගෝනගංආර' },
    { name: 'Konketiya', nameSi: 'කෝන්කැටිය' },
    { name: 'Puhulkotuwa', nameSi: 'පුහුල්කොටුව' },
    { name: 'Yatiyallathota', nameSi: 'යටියැල්ලාතොට' },
    { name: 'Mahasenpura', nameSi: 'මහසෙන්පුර' },
    { name: 'Weheragala', nameSi: 'වෙහෙරගල' },
    { name: 'Kumarapura', nameSi: 'කුමාරපුර' },
    { name: 'Kukurampola', nameSi: 'කුකුරම්පොල' },
    { name: 'Kumaragama', nameSi: 'කුමාරගම' },
    { name: 'Rahathangama', nameSi: 'රහතන්ගම' },
  ],
  Thanamalwila: [
    { name: 'Kandiyapitawewa', nameSi: 'කණ්ඩියපිටවැව' },
    { name: 'Kotaweheramankada', nameSi: 'කොටවෙහෙරමංකඩ' },
    { name: 'Aluthwewa', nameSi: 'අලුත්වැව' },
    { name: 'Hambegamuwa', nameSi: 'හම්බේගමුව' },
    { name: 'Hambegamuwa Janapadaya', nameSi: 'හම්බේගමුව ජනපදය' },
    { name: 'Mahawewa', nameSi: 'මහවැව' },
    { name: 'Kahakurullan Pelessa', nameSi: 'කහකුරුල්ලන් පෑලැස්ස' },
    { name: 'Suriyaara', nameSi: 'සුරියආර' },
    { name: 'Usgala', nameSi: 'උස්ගල' },
    { name: 'Nikawewa', nameSi: 'නිකවැව' },
    { name: 'Siththarama', nameSi: 'සිත්තරම' },
    { name: 'Seenukkuwa', nameSi: 'සීනුක්කුව' },
    { name: 'Bodagama', nameSi: 'බෝදාගම' },
    { name: 'Kiwulara', nameSi: 'කිවුල්ආර' },
  ],
  Sewanagala: [
    { name: 'Katupilagama', nameSi: 'කටුපිලගම' },
    { name: 'Muthuminigama', nameSi: 'මුතුමිණිගම' },
    { name: 'Sewanagala', nameSi: 'සෙවනගල' },
    { name: 'Indikolapelessa', nameSi: 'ඉඳිකොළපෑලැස්ස' },
    { name: 'Bahirawa', nameSi: 'බහිරාව' },
    { name: 'Habaraluwewa', nameSi: 'හබරළුවැව' },
    { name: 'Kiriibbanwewa', nameSi: 'කිරිඉබ්බන්වැව' },
    { name: 'Samagipura', nameSi: 'සමගිපුර' },
    { name: 'Punchiwewa', nameSi: 'පුංචිවැව' },
    { name: 'Weliara', nameSi: 'වැලිආර' },
    { name: 'Nugegalayaya', nameSi: 'නුගේගලයාය' },
    { name: 'Habarugala', nameSi: 'හබරුගල' },
    { name: 'Habaraththawela', nameSi: 'හබරත්තාවෙල' },
    { name: 'Mahagama', nameSi: 'මහගම' },
  ],
};

// ─── Seed Function ─────────────────────────────────────────────────────────────

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await District.deleteMany({});
    await DsDivision.deleteMany({});
    await GnDivision.deleteMany({});
    await Project.deleteMany({});
    await Admin.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // ── Admin user ─────────────────────────────────────────
    const admin = await Admin.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
    });
    console.log(`👤 Admin created: ${admin.username}`);

    // ── District ───────────────────────────────────────────
    const district = await District.create(districtData);
    console.log(`📍 District created: ${district.name}`);

    // ── DS Divisions ───────────────────────────────────────
    const dsMap = {};
    for (const ds of dsDivisions) {
      const created = await DsDivision.create({ ...ds, districtId: district._id });
      dsMap[ds.name] = created;
    }
    console.log(`📍 ${dsDivisions.length} DS Divisions created`);

    // ── GN Divisions ───────────────────────────────────────
    let gnCount = 0;
    const gnMap = {};
    for (const [dsName, gnList] of Object.entries(gnDivisionsByDs)) {
      const dsDoc = dsMap[dsName];
      gnMap[dsName] = [];
      for (const gn of gnList) {
        const created = await GnDivision.create({
          ...gn,
          dsDivisionId: dsDoc._id,
          districtId: district._id,
        });
        gnMap[dsName].push(created);
        gnCount++;
      }
    }
    console.log(`📍 ${gnCount} GN Divisions created`);

    // ── Sample Projects ────────────────────────────────────
    const sampleProjects = [
      {
        projectName: 'මොනරාගල ප්‍රධාන පාර ප්‍රතිසංස්කරණ ව්‍යාපෘතිය',
        description:
          'මොනරාගල නගරයේ ප්‍රධාන පාර ප්‍රතිසංස්කරණය සහ ජලාපවහන පද්ධතිය නවීකරණය කිරීම.',
        districtId: district._id,
        dsDivisionId: dsMap['Monaragala']._id,
        gnDivisionId: gnMap['Monaragala'][0]._id,
        latitude: 6.8722,
        longitude: 81.3498,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-12-31'),
        status: 'ongoing',
        estimatedAmount: 25000000,
      },
      {
        projectName: 'බිබිල ගොවිජන සේවා මධ්‍යස්ථානය',
        description:
          'කුඩා පරිමාණ ගොවීන් සඳහා නූතන ගොවිජන සේවා සහ පුහුණු සැසි පැවැත්වීම.',
        districtId: district._id,
        dsDivisionId: dsMap['Bibile']._id,
        gnDivisionId: gnMap['Bibile'][0]._id,
        latitude: 7.1564,
        longitude: 81.2103,
        startDate: new Date('2023-06-01'),
        endDate: new Date('2024-06-30'),
        status: 'completed',
        estimatedAmount: 8500000,
      },
      {
        projectName: 'වැල්ලවාය ජල සැපයුම් ව්‍යාපෘතිය',
        description:
          'වැල්ලවාය ප්‍රදේශයේ ජලය සැපයීම සඳහා නල ජලය සංවර්ධන ව්‍යාපෘතියක් ක්‍රියාත්මක කිරීම.',
        districtId: district._id,
        dsDivisionId: dsMap['Wellawaya']._id,
        gnDivisionId: gnMap['Wellawaya'][1]._id,
        latitude: 6.7275,
        longitude: 81.1026,
        startDate: new Date('2025-03-01'),
        endDate: new Date('2026-03-31'),
        status: 'planned',
        estimatedAmount: 45000000,
      },
      {
        projectName: 'කතරගම සංචාරක යටිතල පහසුකම් සංවර්ධනය',
        description:
          'කතරගම ශ්‍රී දේවාලය ඉදිරිපිට ඇති සංචාරක යටිතල පහසුකම් නූතනීකරණය.',
        districtId: district._id,
        dsDivisionId: dsMap['Kataragama']._id,
        gnDivisionId: gnMap['Kataragama'][0]._id,
        latitude: 6.4138,
        longitude: 81.3366,
        startDate: new Date('2024-07-01'),
        endDate: new Date('2025-06-30'),
        status: 'ongoing',
        estimatedAmount: 12000000,
      },
      {
        projectName: 'සියඹලාන්ඩුව ග්‍රාමීය විදුලිකරණ ව්‍යාපෘතිය',
        description:
          'සියඹලාන්ඩුව ප්‍රාදේශීය ලේකම් කොට්ඨාශයේ ගම්මාන 15 ක ග්‍රාමීය ප්‍රජාවන්ට ජාතික ග්‍රිඩ් සම්බන්ධ කිරීම.',
        districtId: district._id,
        dsDivisionId: dsMap['Siyambalanduwa']._id,
        gnDivisionId: gnMap['Siyambalanduwa'][2]._id,
        latitude: 7.1481,
        longitude: 81.5832,
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        status: 'completed',
        estimatedAmount: 18000000,
      },
      {
        projectName: 'මොනරාගල දිස්ත්‍රික් රෝහල් ප්‍රතිසංස්කරණය',
        description:
          'මොනරාගල දිස්ත්‍රික් රෝහලේ ICU ඒකකය ප්‍රසාරණය සහ OPD ගොඩනැගිල්ල ප්‍රතිසංස්කරණය.',
        districtId: district._id,
        dsDivisionId: dsMap['Monaragala']._id,
        gnDivisionId: gnMap['Monaragala'][1]._id,
        latitude: 6.8734,
        longitude: 81.3515,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2026-12-31'),
        status: 'planned',
        estimatedAmount: 120000000,
      },
    ];

    await Project.insertMany(sampleProjects);
    console.log(`📋 ${sampleProjects.length} sample projects created`);

    console.log('\n✅ Seeding completed successfully!');
    console.log('─────────────────────────────────────');
    console.log(`🔐 Admin login  → username: ${admin.username} / password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log(`🌐 API base     → http://localhost:${process.env.PORT || 5000}`);
    console.log('─────────────────────────────────────');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
