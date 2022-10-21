import { Injectable, Res } from '@nestjs/common';
import { stringify } from 'querystring';
import { Offer } from './interfaces/activity.interface';

@Injectable()
export class ActivityService {
  private readonly offers: Offer[] = [];
  private readonly actMap: Map<string, string[]> = new Map<string, string[]>();

  constructor() {
    this.offers = [
      {
        nid: '38307666859',
        title: '置物架不锈钢色储物架厨房五层落地可调节收纳架货架阳台多层架子',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i1/306348509/TB2CWKUD79WBuNjSspeXXaz5VXa_!!306348509.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '42919092304',
        title: '北美红雀冬青浆果欧式陶瓷餐具汤锅汤碗汤盆手绘浮雕彩绘带盖耐热',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i2/2273872997/O1CN01F9w7VR1Y0fgB6hZMD_!!2273872997.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '591680886597',
        title: '莫代尔抹胸内搭防走光打底裹胸无肩带黑色内衣白色一片式防滑围胸',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i2/110581102/O1CN01YYjm0f1K0lEATUOkc_!!0-saturn_solar.jpg',
      },
      {
        nid: '526557752623',
        title: '结婚酒盅婚庆用品 大红色双喜 喜庆敬酒杯 交杯酒杯 陶瓷小号杯',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i2/TB18YHBKFXXXXaVXpXXXXXXXXXX_!!0-item_pic.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '645549103771',
        title: 'EKO智能垃圾桶家用客厅轻奢厨房卫生间厕所感应式带盖大号高颜值',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i3/110279682/O1CN01Jrckr22LOPTOfH06Z_!!0-saturn_solar.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '521345135215',
        title: '衣柜收纳神器分层置物架柜子分割隔板宿舍衣服包包收纳篮衣橱隔断',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i3/1624565934/O1CN01RTTRFy1thoztFTvWl_!!0-item_pic.jpg',
      },
      {
        nid: '550238731367',
        title: '木果盘果盆创意家用木质干果盘实木果篮客厅木制根雕大水果盘包邮',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i1/1752732599/TB25KZZobRkpuFjSspmXXc.9XXa_!!1752732599.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '540367958807',
        title: '创意个性纯色简约日式8-10寸螺纹陶瓷餐盘深盘菜盘西餐盘汤盘果盘',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i4/127511105/O1CN01NNi9w81K28MVaVkRJ_!!127511105.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '671270172831',
        title: 'NASA联名官网旗舰店T恤女夏季ins潮牌爱心黑色闺蜜装短袖纯棉宽松',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i4/2252310040/O1CN01lSKv5g1CAMawdGHXj_!!0-saturn_solar.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '526364833615',
        title: '特大号粗管脏衣服收纳篮脏衣篓家用洗衣仿藤编篮子装放衣物筐神器',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i1/355818105/O1CN01kWSvjc29k8lsQ0q6N_!!355818105.jpg',
      },
      {
        nid: '676618649707',
        title: '免去搭配烦恼!省心省力 包容度hin高の衬衣+短裤套装 限时95折',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i4/15885632/O1CN01SQLMlG1rTVPGuRLAS_!!0-saturn_solar.jpg',
      },
      {
        nid: '550610021585',
        title: '304不锈钢筷子勺子套装学生便携两件套金色方形筷家用公筷勺长柄',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i2/789425693/O1CN01F8yIBV1rvRM8JRqpX_!!789425693.jpg',
      },
      {
        nid: '566410281413',
        title: '沙拉加厚加深不锈钢大盆大号洗澡盆家用深盆洗被盆圆形不锈钢盆洗',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i1/55089458/TB1ggJIf_tYBeNjy1XdXXXXyVXa_!!0-item_pic.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '558550389454',
        title: '铁艺支架折叠脏衣篓洗衣篮大号棉麻防水脏衣篮玩具衣物家居收纳筐',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i3/2833970451/TB2Jq8oXPihSKJjy0FlXXadEXXa_!!2833970451.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '592377613054',
        title: '夏季短袖2022年新款女基础款简约纯色圆领T恤丝光棉宽松显瘦上衣',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i1/15976517/O1CN01FFfwN71y0prVMJcra_!!0-saturn_solar.jpg',
      },
      {
        nid: '553931109548',
        title: '特价超大号60*40烤全羊托盘大号木盘实木长方形家用杯盘上菜餐盘',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i3/1731048090/O1CN01XeJcio29dGqg0ceN9_!!1731048090.jpg',
      },
      {
        nid: '553128380537',
        title: '古贝莎品牌女装夏高端时尚蕾丝刺绣短袖中年妈妈A字修身连衣裙潮',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i3/1082379893/TB2349YxhhmpuFjSZFyXXcLdFXa_!!1082379893.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '570534594739',
        title: '办公室A4纸收纳盒abs超厚实抗摔可叠加桌面文件收纳盒首饰储物盒',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i3/675424149/O1CN01XrhXGQ1gWI1Y37elA_!!675424149.jpg',
      },
      {
        nid: '640816524649',
        title: 'FRLMK/弗然克/国潮牌情侣嘻哈基础logo陈誉庚同款刺绣流苏T恤短袖',
        pict_url:
          '//img.alicdn.com/imgextra/i1/2206860893209/O1CN01PMUAdO1ZZljHQOmbg_!!2206860893209-0-alimamacc.jpg',
      },
      {
        nid: '554469928951',
        title: '欧丽家珐琅搪瓷壶烧水壶奶茶壶煮花茶夏天熬药壶电磁炉明火通用',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i3/1026127024/O1CN01NotP2S21l2ieduKeW_!!0-item_pic.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '654419228186',
        title: '奥特莱斯outlets官网清仓捡漏专柜大牌法式褶皱铆钉尖头软皮平底',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i3/50879671/O1CN01VnLbLY2LJN6HlcTUL_!!0-saturn_solar.jpg',
      },
      {
        nid: '572724782266',
        title: '厨房调料置物架墙上壁挂免打孔多功能调味品罐瓶收纳用品家用大全',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i1/2181944488/O1CN01rffqsQ1j1Y78R2wt4_!!0-item_pic.jpg',
      },
      {
        nid: '673195103878',
        title: '气质修身碎花雪纺连衣裙中长款2022年夏季新款时尚女人味遮肚子裙',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i3/119114292/O1CN011vRlCu1hZmfZchkYU_!!0-saturn_solar.jpg',
      },
      {
        nid: '566698840021',
        title: '加厚耐热家用玻璃水杯套装6只琥珀色泡茶杯茶杯果汁啤酒杯带杯架',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i3/2371085053/O1CN013ZPbLu1nCJzMpmVWH_!!2371085053.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '676540200005',
        title: '胡桃木JK蒲岛私立初等部6.25晚八点红色卡奶裙可爱学生JK制服',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i3/130540338/O1CN017eAKJ31EMqdJtCFoq_!!0-saturn_solar.jpg',
      },
      {
        nid: '577552870657',
        title: '五星级酒店用羽丝绒被芯全棉春秋被空调被夏凉被保暖纤维冬被子',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i3/717880390/O1CN01IrIsYu1EkfA8bDLKH_!!717880390.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '676222829171',
        title: '[WALKINDARK]青山远黛新中式国风短款上衣薄开衫半身裙套装女夏',
        pict_url:
          '//img.alicdn.com/imgextra/i1/2429524469/O1CN01BqTEJ41isqmWw6Rmv_!!2429524469-0-alimamacc.jpg',
      },
      {
        nid: '567161053721',
        title: '泰国进口 chabatree 柚木深口汤勺日式实木拉面汤勺舀粥勺无漆',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i2/3814691387/TB2DGu4krSYBuNjSspfXXcZCpXa_!!3814691387.jpg',
      },
      {
        nid: '12366457328',
        title: '川南电动车液压舒适后减震巧格迅鹰福喜避震器27/29/31cm红/银/黑',
        pict_url:
          '//img.alicdn.com/bao/uploaded///asearch.alicdn.com/bao/uploaded/O1CN0196LAUI1WbC4StwkVz_!!268362806.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '577696444827',
        title: '居家家双层镂空洗菜篮子洗水果沥水篮筐家用厨房水果篮洗菜漏水盆',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i1/50983440/O1CN01tbJC781bHZ1X5Xq1T_!!50983440.jpg',
      },
      {
        nid: '675938400014',
        title: '大号洗澡沐浴球泡澡球浴花可爱搓澡搓背起泡洗浴用品沐浴花洗澡巾',
        pict_url:
          '//img.alicdn.com/bao/uploaded///asearch.alicdn.com/bao/uploaded/O1CN017cAbGt1DfL0J7mur9_!!1710390243.jpg',
      },
      {
        nid: '572597586234',
        title: '励志杯创意陶瓷杯刻字马克杯定制LOGO复古茶杯经典怀旧仿搪瓷缸子',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i2/2733490055/TB2V.nNeMZC2uNjSZFnXXaxZpXa_!!2733490055.jpg',
      },
      {
        nid: '671615559531',
        title: '真丝连衣裙子女装桑蚕丝2022年夏季新款中年杭州双绉洋气奢华收腰',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i3/1761120064/O1CN01FJLfLi1CLM6NKiSFG_!!0-saturn_solar.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '581917391296',
        title: '乐荷公园 洗衣篮脏衣篮北欧拼色棉线收纳筐玩具收纳家居洗衣篓',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i1/1931820107/O1CN01YC5v271Cf2t2qD5cp_!!1931820107.jpg',
      },
      {
        nid: '677081823503',
        title: '儿童早教指读棒学生读书阅读可爱手指教鞭教师专用教条家用黑板用',
        pict_url:
          '//img.alicdn.com/bao/uploaded///asearch.alicdn.com/bao/uploaded/O1CN01ZcrxfM2G9EGLiznTE_!!2097548972.jpg',
      },
      {
        nid: '583147890625',
        title: '食品级小学生餐垫硅胶餐垫可折叠餐布防水防油渍隔热儿童午餐桌布',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i4/341532597/O1CN01RFLEmi1V3TH9fYk50_!!341532597.jpg',
      },
      {
        nid: '669627146065',
        title: '5.30小苍葵现货喵仙生jk制服套装原创运动服体操服春季学生校服女',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i3/115575237/O1CN01OvHRNt1oYaxJsPnc6_!!0-saturn_solar.jpg',
      },
      {
        nid: '583289251216',
        title: '红酒杯玻璃高脚杯彩色复古香槟创意果汁杯家用加厚红酒杯酒具',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i2/4058827435/O1CN01JnvMgi24nHEJ2lsGC_!!4058827435.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '671291372358',
        title: '纤莉秀2022夏装新款胖mm大码女装温柔个性拼接蕾丝V领套头针织衫',
        pict_url:
          '//img.alicdn.com/bao/uploaded///asearch.alicdn.com/bao/uploaded/O1CN01inI2qd1p7rSPKZYDG_!!0-item_pic.jpg',
      },
      {
        nid: '591212919686',
        title: '床边收纳袋挂袋 床头挂篮放手机神器 床上袋子小布袋墙挂式置物架',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i1/1993812065/O1CN01vVj9iT1R7oOBof6Dc_!!0-item_pic.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '670253665253',
        title: '2322新品网红农村自建别墅设计图纸二层网红现代风格简约平顶乡村',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i3/4227643880/O1CN01loGHPC1eX5TlRmBlK_!!4227643880.jpg',
      },
      {
        nid: '592273398472',
        title: '日式无铅玻璃泡菜坛子一夜渍浅渍加厚重石家用腌菜容器咸菜罐菜缸',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i2/712760556/O1CN01oOPpuR1FyguDb06ZF_!!0-item_pic.jpg',
      },
      {
        nid: '674624747686',
        title: '宝诗黎泡泡袖系带碎花裙2022年新款短袖连衣裙减龄中长款裙子女夏',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i3/24803035/O1CN01Mxx2wx1YI4ogwFy47_!!0-saturn_solar.jpg',
      },
      {
        nid: '591505221899',
        title: '香槟色蛋糕架 西餐桌装饰品 婚礼甜品台摆件浅金色甜品架蛋糕托盘',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i2/1663735410/O1CN01aUgFhC1pppEPUsZWi_!!1663735410.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '670673517935',
        title: 'OHME2022夏少女刺绣PoloT恤休闲时尚oversize绣花短袖运动套装',
        pict_url:
          '//img.alicdn.com/imgextra/i2/895971623/O1CN01umnj5Z1NrNYv9PTVr_!!895971623-0-alimamacc.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '592307387712',
        title: '参宝中式碗青花瓷碗餐具韩式碗家用饭碗汤碗汤面碗大汤盘带盖碗',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i3/2200825225762/O1CN01Ymmour1sR2pfyGAWO_!!0-item_pic.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '672792257240',
        title: '高端轻奢鱼尾裙蕾丝敬酒服高贵妈妈日常可穿晚宴服法式连衣裙春夏',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i1/41284997/O1CN01d3y6pH1mmftXo1zDf_!!0-saturn_solar.jpg',
      },
      {
        nid: '592890397740',
        title: '韩国新款潮装饰皮带简约百搭复古腰带女西装裤牛仔裤配裙子宽皮带',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i4/772461325/O1CN017ReNKB1LetRVfoVLe_!!0-item_pic.jpg',
      },
      {
        nid: '673784264444',
        title: '不允许你没穿过这鞋2022夏季新款经典复古低帮帆布鞋透气板鞋男',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i1/1668720128/O1CN01YbGjcS1CofS7BJyYA_!!0-saturn_solar.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '593172291193',
        title: '日本松尾可爱饭碗料理小碗喝汤水果碗女生创意动物图案瓷碗吃面碗',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i1/692324452/O1CN01GQ9d0K1il3uxNRzjb_!!692324452.jpg',
      },
      {
        nid: '673643836923',
        title: '蝴蝶结连衣裙女夏',
        pict_url:
          '//img.alicdn.com/imgextra/i4/85259349/O1CN01sG5qBS2IvtZq0QPWK_!!85259349-0-alimamacc.jpg',
      },
      {
        nid: '594313272435',
        title: 'ins美国风设计款个性储物罐陶瓷复古浮雕设计正方形收纳罐茶叶罐',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i3/2638036375/O1CN01D3Rq3Y1wxnRxr07MT_!!2638036375.png',
      },
      {
        nid: '669713742079',
        title: 'Uncle MJ  蝴蝶结浅口单鞋女新款仙女时尚百搭尖头舒适孕妇平底鞋',
        pict_url:
          '//img.alicdn.com/bao/uploaded///asearch.alicdn.com/bao/uploaded/O1CN01GhFk5s1jvt03Fe57A_!!72674611.jpg',
      },
      {
        nid: '593849438739',
        title: '超轻薄大容量奶茶杯玻璃杯冰咖啡杯冰美式冰拿铁玻璃杯子防爆耐热',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i1/311551495/O1CN01Ib06zj1Muke0WRisk_!!311551495.jpg',
      },
      {
        nid: '668939835704',
        title: 'profinn日系潮牌字母刺绣宽松百搭白色男女2022夏季国潮街头短袖',
        pict_url:
          '//img.alicdn.com/bao/uploaded///asearch.alicdn.com/bao/uploaded/O1CN01mhWiB31pEGyRt2AE3_!!249855328.jpg',
      },
      {
        nid: '598504121380',
        title: '日本厨房不锈钢切蛋器多功能分鸡蛋器松花蛋切片器花式切皮蛋神器',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i1/82285736/O1CN01KtXFW31sF8NSCgFTo_!!82285736.jpg',
        icons: [
          {
            bg_color: '#FFFFFF',
            font_color: '#FF5000',
            text: '送运费险',
            source: 'yunfeixian',
            border_color: '#FAB596',
            type: '1',
          },
        ],
      },
      {
        nid: '671324303895',
        title: '时尚百褶裙套装女夏季韩版小个子穿搭休闲可盐可甜学院风两件套',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i1/132536226/O1CN01yuVWMj1vrYfHDnseZ_!!0-saturn_solar.jpg',
      },
      {
        nid: '597922086481',
        title: '日式复古绿色线条西餐盘甜品盘早餐沙拉盘 日本ins陶瓷椭圆盘圆盘',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i4/2567464382/O1CN01fsFDN91iF083IAhd4_!!2567464382.jpg',
      },
      {
        nid: '615108383136',
        title: '锦瑟春季文艺复古苎麻印花衬衫改良盘扣中国风禅意茶服长袖小上衣',
        pict_url:
          '//img.alicdn.com/bao/uploaded///asearch.alicdn.com/bao/uploaded/O1CN0132xF5S1ZpnQe3ayYM_!!50763244.jpg',
      },
      {
        nid: '640142596420',
        title: 'MAJE KARA波点雪纺衬衫女夏新款宽松小个子显高半身裙两件套装女',
        pict_url:
          '//img.alicdn.com/bao/uploaded/i4/15096188/O1CN01pikS0F1va9buIxg2M_!!0-saturn_solar.jpg',
      },
    ];

    this.create('123');
    this.create('124');
    this.create('125');
  }

  create(activityId: string) {
    const offerIds = [];
    for (const offer of this.offers) {
      offerIds.push(offer.nid);
    }
    const res = [];
    const l = offerIds.length;
    while (res.length < 20) {
      const id = offerIds[Math.floor(Math.random() * l)];
      if (res.indexOf(id) < 0) {
        res.push(id);
      }
    }
    this.actMap.set(activityId, res);
  }

  findOne(id: string): Offer[] {
    const offerIds = this.actMap.get(id);
    if (offerIds) {
      return offerIds.map((v) => {
        return this.offers.find((o) => o.nid === v);
      });
    } else {
      return [];
    }
  }
}
