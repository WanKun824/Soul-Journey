
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, Dimension, UserDemographics, QuizAnswer, MatchProfile, Language, QuestionType } from "../types";

const apiKey = process.env.API_KEY || '';

// --- MASTER QUESTION BANK (Trilingual) ---
interface BankQuestion {
    id: number;
    dimension: Dimension;
    text: {
        en: string;
        zh: string;
        ja: string;
    };
}

const MASTER_QUESTION_BANK: BankQuestion[] = [
    // --- 1. WEALTH & CONSUMPTION (金钱与消费观) ---
    { id: 101, dimension: Dimension.WEALTH, text: { en: "I often buy things impulsively to make myself feel better.", zh: "我经常冲动购物来让自己开心。", ja: "気分を良くするために衝動買いをすることがよくある。" } },
    { id: 102, dimension: Dimension.WEALTH, text: { en: "Saving for the future is more important than enjoying the present.", zh: "为未来储蓄比享受当下更重要。", ja: "現在を楽しむことよりも、将来のために貯蓄することの方が重要だ。" } },
    { id: 103, dimension: Dimension.WEALTH, text: { en: "I believe taking on debt (like loans) is acceptable for quality of life.", zh: "我认为为了生活质量背负债务（如贷款）是可以接受的。", ja: "生活の質を高めるためなら、借金（ローンなど）をしても構わないと思う。" } },
    { id: 104, dimension: Dimension.WEALTH, text: { en: "I prefer spending money on experiences (travel, concerts) over material goods.", zh: "相比实物，我更愿意在体验（旅行、演唱会）上花钱。", ja: "モノよりも体験（旅行、コンサートなど）にお金を使いたい。" } },
    { id: 105, dimension: Dimension.WEALTH, text: { en: "It is important that my partner earns as much or more than I do.", zh: "伴侣的收入与我相当或比我高很重要。", ja: "パートナーが自分と同等、あるいはそれ以上の収入を得ることは重要だ。" } },
    { id: 106, dimension: Dimension.WEALTH, text: { en: "I track my expenses carefully every month.", zh: "我每个月都会仔细记账。", ja: "毎月の支出を細かく管理している。" } },
    { id: 107, dimension: Dimension.WEALTH, text: { en: "Spending a lot of money on a luxury meal feels wasteful to me.", zh: "花大价钱吃一顿豪华大餐对我来说是浪费。", ja: "豪華な食事に大金を使うのは無駄だと感じる。" } },
    { id: 108, dimension: Dimension.WEALTH, text: { en: "I am willing to lower my standard of living to pursue a dream.", zh: "为了追求梦想，我愿意降低生活标准。", ja: "夢を追いかけるためなら、生活水準を下げても構わない。" } },
    { id: 109, dimension: Dimension.WEALTH, text: { en: "Couples should have completely separate bank accounts.", zh: "夫妻应该拥有完全独立的银行账户（AA制）。", ja: "夫婦は完全に別の銀行口座を持つべきだ。" } },
    { id: 110, dimension: Dimension.WEALTH, text: { en: "Financial security is the most important factor in my life choices.", zh: "经济安全感是我人生选择中最重要的因素。", ja: "経済的な安定は、人生の選択において最も重要な要素だ。" } },
    { id: 111, dimension: Dimension.WEALTH, text: { en: "I define success primarily by accumulated wealth.", zh: "我主要通过积累的财富来定义成功。", ja: "私は主に蓄積された富によって成功を定義する。" } },
    { id: 112, dimension: Dimension.WEALTH, text: { en: "I would rather rent a nice apartment than save for a modest house.", zh: "我宁愿租一套好的公寓，也不愿为了一套普通的房子存钱。", ja: "質素な家のために貯金するより、素敵なアパートを借りたい。" } },
    { id: 113, dimension: Dimension.WEALTH, text: { en: "Generosity with money is one of my core traits.", zh: "在金钱上大方是我的核心特质之一。", ja: "金銭的に寛大であることは、私の中心的な特徴の一つだ。" } },
    { id: 114, dimension: Dimension.WEALTH, text: { en: "I feel anxious when I do not have a specific financial plan.", zh: "没有具体的财务计划会让我感到焦虑。", ja: "具体的な財務計画がないと不安を感じる。" } },
    { id: 115, dimension: Dimension.WEALTH, text: { en: "I enjoy discussing investment strategies with my partner.", zh: "我喜欢和伴侣讨论投资策略。", ja: "パートナーと投資戦略について話し合うのが好きだ。" } },
    { id: 116, dimension: Dimension.WEALTH, text: { en: "I believe in prenup agreements regardless of trust.", zh: "无论信任与否，我都相信婚前协议的必要性。", ja: "信頼関係にかかわらず、婚前契約は必要だと信じている。" } },

    // --- 2. FAMILY & BOUNDARIES (家庭与人际边界) ---
    { id: 201, dimension: Dimension.FAMILY, text: { en: "My parents' approval is crucial for my major life decisions.", zh: "父母的认可对我的人生重大决定至关重要。", ja: "人生の重要な決断において、両親の承認は不可欠だ。" } },
    { id: 202, dimension: Dimension.FAMILY, text: { en: "I expect to live near my parents to take care of them.", zh: "我希望住得离父母近一点，以便照顾他们。", ja: "両親の世話をするために、近くに住むつもりだ。" } },
    { id: 203, dimension: Dimension.FAMILY, text: { en: "Having children is a non-negotiable goal in my life.", zh: "生孩子是我人生中不可协商的目标。", ja: "子供を持つことは、私の人生において譲れない目標だ。" } },
    { id: 204, dimension: Dimension.FAMILY, text: { en: "I prefer a small, private wedding over a large traditional one.", zh: "相比传统的大型婚礼，我更喜欢小型的私密婚礼。", ja: "盛大な伝統的な結婚式より、小規模でプライベートな結婚式の方が好きだ。" } },
    { id: 205, dimension: Dimension.FAMILY, text: { en: "Even after marriage, my friends are as important as my spouse.", zh: "即使婚后，我的朋友和配偶一样重要。", ja: "結婚後も、友人は配偶者と同じくらい重要だ。" } },
    { id: 206, dimension: Dimension.FAMILY, text: { en: "I need strong boundaries between my new family and my original family.", zh: "我的小家庭和原生家庭之间需要有明确的界限。", ja: "新しい家族と実家の間には、しっかりとした境界線が必要だ。" } },
    { id: 207, dimension: Dimension.FAMILY, text: { en: "I believe strict discipline is necessary for raising children.", zh: "我认为养育孩子必须要有严格的纪律。", ja: "子育てには厳格な規律が必要だと思う。" } },
    { id: 208, dimension: Dimension.FAMILY, text: { en: "I am comfortable with my in-laws dropping by unannounced.", zh: "我不介意岳父母/公婆不打招呼直接来家里。", ja: "義理の両親が予告なしに訪ねてきても気にならない。" } },
    { id: 209, dimension: Dimension.FAMILY, text: { en: "Family traditions must be preserved even if they are inconvenient.", zh: "即使不方便，家庭传统也必须保留。", ja: "不便であっても、家族の伝統は守られるべきだ。" } },
    { id: 210, dimension: Dimension.FAMILY, text: { en: "I prioritize my partner's feelings over my parents' wishes.", zh: "相比父母的意愿，我更优先考虑伴侣的感受。", ja: "両親の希望よりも、パートナーの気持ちを優先する。" } },
    { id: 211, dimension: Dimension.FAMILY, text: { en: "I expect my partner to participate in all my family gatherings.", zh: "我希望我的伴侣参加我所有的家庭聚会。", ja: "パートナーには、私の家族の集まりすべてに参加してほしい。" } },
    { id: 212, dimension: Dimension.FAMILY, text: { en: "My siblings are my best friends.", zh: "我的兄弟姐妹是我最好的朋友。", ja: "兄弟姉妹は私の親友だ。" } },
    { id: 213, dimension: Dimension.FAMILY, text: { en: "I believe in distinct gender roles within a household.", zh: "我相信家庭内部应该有明确的性别分工。", ja: "家庭内では明確な性別による役割分担が必要だと信じている。" } },
    { id: 214, dimension: Dimension.FAMILY, text: { en: "I would sacrifice my career for my family's stability.", zh: "为了家庭的稳定，我愿意牺牲我的事业。", ja: "家族の安定のためなら、キャリアを犠牲にしても構わない。" } },
    { id: 215, dimension: Dimension.FAMILY, text: { en: "Privacy is more important to me than sharing everything.", zh: "对我来说，隐私比分享一切更重要。", ja: "私にとって、すべてを共有することよりプライバシーの方が重要だ。" } },
    { id: 216, dimension: Dimension.FAMILY, text: { en: "I want to raise my children with different values than I was raised with.", zh: "我希望用不同于我父母的方式来抚养我的孩子。", ja: "自分が育てられたのとは違う価値観で子供を育てたい。" } },

    // --- 3. LIFESTYLE & PACE (生活方式与节奏) ---
    { id: 301, dimension: Dimension.LIFESTYLE, text: { en: "I prefer to spend my weekends relaxing at home rather than going out.", zh: "周末我更喜欢在家休息，而不是出去玩。", ja: "週末は外出するより、家でリラックスして過ごしたい。" } },
    { id: 302, dimension: Dimension.LIFESTYLE, text: { en: "A messy room causes me significant stress.", zh: "凌乱的房间会让我感到非常有压力。", ja: "部屋が散らかっていると、かなりのストレスを感じる。" } },
    { id: 303, dimension: Dimension.LIFESTYLE, text: { en: "I like to have every detail of my vacation planned in advance.", zh: "我喜欢提前计划好假期的每一个细节。", ja: "休暇の計画は、細部まで事前に決めておきたい。" } },
    { id: 304, dimension: Dimension.LIFESTYLE, text: { en: "I prioritize career success over leisure time.", zh: "我看重事业成功胜过闲暇时间。", ja: "余暇の時間よりも、キャリアの成功を優先する。" } },
    { id: 305, dimension: Dimension.LIFESTYLE, text: { en: "I enjoy trying new food and exotic cuisines regularly.", zh: "我喜欢经常尝试新食物和异国料理。", ja: "新しい食べ物やエキゾチックな料理を定期的に試すのが好きだ。" } },
    { id: 306, dimension: Dimension.LIFESTYLE, text: { en: "I prefer a minimalist home with very few possessions.", zh: "我喜欢极简的家，几乎没有什么杂物。", ja: "物がほとんどないミニマリストな家が好きだ。" } },
    { id: 307, dimension: Dimension.LIFESTYLE, text: { en: "I need a lot of personal space and alone time daily.", zh: "我每天都需要大量的个人空间和独处时间。", ja: "毎日、多くの個人的なスペースと一人の時間が必要だ。" } },
    { id: 308, dimension: Dimension.LIFESTYLE, text: { en: "I am an early riser and productive in the morning.", zh: "我是个早起的人，早晨效率很高。", ja: "私は早起きで、朝の方が生産的だ。" } },
    { id: 309, dimension: Dimension.LIFESTYLE, text: { en: "I prefer urban city life over quiet countryside living.", zh: "相比安静的乡村，我更喜欢城市的喧嚣。", ja: "静かな田舎暮らしより、都会の生活の方が好きだ。" } },
    { id: 310, dimension: Dimension.LIFESTYLE, text: { en: "Spontaneity excites me more than stability.", zh: "随性而为比稳定更让我兴奋。", ja: "安定よりも自発性（その場のノリ）にワクワクする。" } },
    { id: 311, dimension: Dimension.LIFESTYLE, text: { en: "I exercise consistently as a non-negotiable routine.", zh: "我坚持锻炼，这是不可协商的日常。", ja: "私は日常のルーチンとして欠かさず運動している。" } },
    { id: 312, dimension: Dimension.LIFESTYLE, text: { en: "I prefer deep conversations over loud parties.", zh: "相比吵闹的派对，我更喜欢深度的交谈。", ja: "騒がしいパーティーより、深い会話の方が好きだ。" } },
    { id: 313, dimension: Dimension.LIFESTYLE, text: { en: "I cannot tolerate being late or people who are late.", zh: "我无法容忍迟到或迟到的人。", ja: "遅刻や、時間にルーズな人を我慢できない。" } },
    { id: 314, dimension: Dimension.LIFESTYLE, text: { en: "I enjoy hosting events and cooking for others.", zh: "我喜欢举办活动并为他人做饭。", ja: "イベントを主催したり、人のために料理をするのが好きだ。" } },
    { id: 315, dimension: Dimension.LIFESTYLE, text: { en: "Fashion and appearance are very important to me.", zh: "时尚和外表对我来说非常重要。", ja: "ファッションや外見は私にとって非常に重要だ。" } },
    { id: 316, dimension: Dimension.LIFESTYLE, text: { en: "I prefer analog hobbies (reading, crafting) over digital ones (gaming).", zh: "相比数字爱好（游戏），我更喜欢模拟爱好（阅读、手工艺）。", ja: "デジタルな趣味（ゲーム）より、アナログな趣味（読書、工作）の方が好きだ。" } },

    // --- 4. CONFLICT & COMMUNICATION (冲突解决与沟通模式) ---
    { id: 401, dimension: Dimension.COMMUNICATION, text: { en: "When angry, I tend to go silent and need time to cool off.", zh: "生气时，我倾向于沉默（冷战），需要时间冷静。", ja: "怒ると黙り込んでしまい、頭を冷やす時間が必要になる。" } },
    { id: 402, dimension: Dimension.COMMUNICATION, text: { en: "I believe in expressing dissatisfaction immediately and directly.", zh: "我认为应该立即直接地表达不满。", ja: "不満はすぐに、直接表現するべきだと思う。" } },
    { id: 403, dimension: Dimension.COMMUNICATION, text: { en: "I often apologize first just to end an argument.", zh: "为了结束争吵，我经常会先道歉。", ja: "口論を終わらせるためだけに、自分から先に謝ることがよくある。" } },
    { id: 404, dimension: Dimension.COMMUNICATION, text: { en: "Logic and facts are more important than feelings in an argument.", zh: "在争论中，逻辑和事实比感受更重要。", ja: "議論においては、感情よりも論理や事実の方が重要だ。" } },
    { id: 405, dimension: Dimension.COMMUNICATION, text: { en: "I want my partner to guess my needs without me saying them.", zh: "我希望伴侣能猜到我的需求，而不用我明说。", ja: "言わなくてもパートナーに自分のニーズを察してほしい。" } },
    { id: 406, dimension: Dimension.COMMUNICATION, text: { en: "I feel attacked easily when receiving criticism.", zh: "受到批评时，我很容易觉得被攻击。", ja: "批判されると、すぐに攻撃されたと感じてしまう。" } },
    { id: 407, dimension: Dimension.COMMUNICATION, text: { en: "It is okay to raise your voice during a heated debate.", zh: "激烈的辩论中提高嗓门是可以接受的。", ja: "激しい議論の中で声を荒らげるのは許容範囲だ。" } },
    { id: 408, dimension: Dimension.COMMUNICATION, text: { en: "I prefer to resolve conflicts before going to sleep.", zh: "我倾向于在睡前解决所有矛盾。", ja: "対立は寝る前に解決したい。" } },
    { id: 409, dimension: Dimension.COMMUNICATION, text: { en: "I need constant verbal affirmation of love.", zh: "我需要持续的口头爱意确认。", ja: "愛の言葉による確認が常に必要だ。" } },
    { id: 410, dimension: Dimension.COMMUNICATION, text: { en: "Compromise is essential, even if it means sacrificing my preference.", zh: "妥协是必不可少的，即使意味着牺牲我的偏好。", ja: "自分の好みを犠牲にしてでも、妥協は不可欠だ。" } },
    { id: 411, dimension: Dimension.COMMUNICATION, text: { en: "I often use sarcasm to express frustration.", zh: "我经常用讽刺来表达沮丧。", ja: "欲求不満を表すために皮肉をよく使う。" } },
    { id: 412, dimension: Dimension.COMMUNICATION, text: { en: "I prefer to communicate via text rather than face-to-face for serious issues.", zh: "对于严肃的问题，我更喜欢用文字沟通而不是当面谈。", ja: "深刻な問題については、対面よりもテキストで伝える方が好きだ。" } },
    { id: 413, dimension: Dimension.COMMUNICATION, text: { en: "I hold grudges for a long time after an argument.", zh: "争吵后，我会记仇很久。", ja: "口論の後、長い間根に持つことがある。" } },
    { id: 414, dimension: Dimension.COMMUNICATION, text: { en: "I need a lot of physical touch to feel connected after a fight.", zh: "争吵后，我需要大量的肢体接触来重建连接。", ja: "喧嘩の後、繋がりを感じるために多くのスキンシップを必要とする。" } },
    { id: 415, dimension: Dimension.COMMUNICATION, text: { en: "I tend to analyze my partner's words for hidden meanings.", zh: "我倾向于分析伴侣话语中的隐含意义。", ja: "パートナーの言葉の裏の意味を分析しがちだ。" } },
    { id: 416, dimension: Dimension.COMMUNICATION, text: { en: "Complete honesty is better than a white lie, even if it hurts.", zh: "即使会伤人，完全的诚实也比善意的谎言要好。", ja: "たとえ傷つくとしても、善意の嘘より完全な正直さの方が良い。" } },

    // --- 5. GROWTH & BELIEFS (个人成长与精神世界) ---
    { id: 501, dimension: Dimension.GROWTH, text: { en: "I am constantly seeking to learn new skills or knowledge.", zh: "我不断寻求学习新技能或知识。", ja: "常に新しいスキルや知識を学ぼうとしている。" } },
    { id: 502, dimension: Dimension.GROWTH, text: { en: "I believe everything happens for a reason (fate).", zh: "我相信一切发生皆有原因（命运）。", ja: "すべての出来事には意味がある（運命）と信じている。" } },
    { id: 503, dimension: Dimension.GROWTH, text: { en: "It is important that my partner shares my political views.", zh: "伴侣分享我的政治观点很重要。", ja: "パートナーが自分と同じ政治的見解を持つことは重要だ。" } },
    { id: 504, dimension: Dimension.GROWTH, text: { en: "I am ambitious and want to achieve high social status.", zh: "我有野心，想要获得较高的社会地位。", ja: "私には野心があり、高い社会的地位を築きたい。" } },
    { id: 505, dimension: Dimension.GROWTH, text: { en: "I value tradition and stability over change and progress.", zh: "我看重传统和稳定胜过变革和进步。", ja: "変化や進歩よりも、伝統や安定を重んじる。" } },
    { id: 506, dimension: Dimension.GROWTH, text: { en: "I often reflect on the meaning of life.", zh: "我经常思考人生的意义。", ja: "人生の意味についてよく考える。" } },
    { id: 507, dimension: Dimension.GROWTH, text: { en: "I prefer a partner who challenges me intellectually.", zh: "我喜欢能在智力上挑战我的伴侣。", ja: "知的な刺激を与えてくれるパートナーが好きだ。" } },
    { id: 508, dimension: Dimension.GROWTH, text: { en: "Religious or spiritual beliefs are central to my life.", zh: "宗教或精神信仰是我生活的核心。", ja: "宗教的または精神的な信念は、私の人生の中心にある。" } },
    { id: 509, dimension: Dimension.GROWTH, text: { en: "I believe people can fundamentally change who they are.", zh: "我相信人可以从根本上改变自己。", ja: "人は根本的に変わることができると信じている。" } },
    { id: 510, dimension: Dimension.GROWTH, text: { en: "Societal contribution is more important than personal happiness.", zh: "社会贡献比个人幸福更重要。", ja: "個人の幸福よりも社会への貢献の方が重要だ。" } },
    { id: 511, dimension: Dimension.GROWTH, text: { en: "I am willing to move to a different country for a new experience.", zh: "为了新的体验，我愿意搬到另一个国家。", ja: "新しい経験のために、別の国に移住しても構わない。" } },
    { id: 512, dimension: Dimension.GROWTH, text: { en: "I rely on astrology or tarot for guidance.", zh: "我依赖占星术或塔罗牌的指引。", ja: "占星術やタロットの導きを頼りにしている。" } },
    { id: 513, dimension: Dimension.GROWTH, text: { en: "I believe in the existence of soulmates.", zh: "我相信灵魂伴侣的存在。", ja: "ソウルメイトの存在を信じている。" } },
    { id: 514, dimension: Dimension.GROWTH, text: { en: "Scientific evidence is the only truth I accept.", zh: "科学证据是我接受的唯一真理。", ja: "科学的証拠だけが私の受け入れる真実だ。" } },
    { id: 515, dimension: Dimension.GROWTH, text: { en: "Art and beauty are essential for my well-being.", zh: "艺术和美对我来说是必不可少的。", ja: "芸術と美は、私の幸福にとって不可欠だ。" } },
    { id: 516, dimension: Dimension.GROWTH, text: { en: "I prioritize self-care and mental health over external achievements.", zh: "我看重自我照顾和心理健康胜过外在成就。", ja: "外的成功よりも、セルフケアとメンタルヘルスを優先する。" } }
];

// Helper to shuffle array
function shuffleArray<T>(array: T[]): T[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

// Generate questions (randomly selected from bank)
export const generateQuizQuestions = async (language: Language = 'en'): Promise<Question[]> => {
  const selectedQuestions: Question[] = [];
  
  const dimensions = [
      Dimension.WEALTH,
      Dimension.FAMILY,
      Dimension.LIFESTYLE,
      Dimension.COMMUNICATION,
      Dimension.GROWTH
  ];

  dimensions.forEach(dim => {
      const dimQuestions = MASTER_QUESTION_BANK.filter(q => q.dimension === dim);
      const shuffled = shuffleArray(dimQuestions);
      // Pick 12 per dimension = 60 questions total
      const picked = shuffled.slice(0, 12).map(q => ({
          id: q.id,
          text: q.text[language], // Map to selected language
          dimension: dim,
          questionType: 'likert' as QuestionType
      }));
      selectedQuestions.push(...picked);
  });

  return selectedQuestions;
};

// Translate existing questions to new language (preserving IDs)
export const translateQuestions = (currentQuestions: Question[], targetLang: Language): Question[] => {
    return currentQuestions.map(q => {
        const masterQ = MASTER_QUESTION_BANK.find(mq => mq.id === q.id);
        if (masterQ) {
            return { ...q, text: masterQ.text[targetLang] };
        }
        return q;
    });
};

// Common score calculation logic (used for both local and AI flows to guarantee chart data)
const calculateScores = (questions: Question[], answers: QuizAnswer[], language: Language) => {
    const dimensions: Record<string, number> = {};
    const counts: Record<string, number> = {};

    questions.forEach(q => {
        const ans = answers.find(a => a.questionId === q.id);
        if (ans) {
            dimensions[q.dimension] = (dimensions[q.dimension] || 0) + ans.value;
            counts[q.dimension] = (counts[q.dimension] || 0) + 1;
        }
    });

    return Object.keys(dimensions).map(dim => {
        const maxScore = counts[dim] * 5;
        const rawScore = dimensions[dim];
        const normalized = Math.round((rawScore / maxScore) * 100);
        
        let label = 'Balanced';
        if (normalized > 60) label = 'High';
        if (normalized < 40) label = 'Low';
        
        if (language === 'zh') {
            if (normalized > 60) label = '高倾向';
            else if (normalized < 40) label = '低倾向';
            else label = '平衡';
        } else if (language === 'ja') {
             if (normalized > 60) label = '高い';
            else if (normalized < 40) label = '低い';
            else label = 'バランス';
        }

        return {
            dimension: dim,
            score: normalized,
            label: label
        };
    });
};

const saveProfileToDatabase = async (profile: MatchProfile) => {
    try {
        const existingData = localStorage.getItem('soulcompass_db');
        const db = existingData ? JSON.parse(existingData) : {};
        db[profile.soulId] = profile;
        localStorage.setItem('soulcompass_db', JSON.stringify(db));
    } catch (e) {
        console.error("Local storage save failed", e);
    }
    return new Promise(resolve => setTimeout(resolve, 300));
};

export const getProfileBySoulId = async (soulId: string): Promise<MatchProfile | null> => {
    try {
        const existingData = localStorage.getItem('soulcompass_db');
        if (existingData) {
            const db = JSON.parse(existingData);
            if (db[soulId]) return db[soulId];
        }
    } catch (e) {
        console.error("Local storage read failed", e);
    }
    return null;
}

// Fallback / Offline Analysis
const analyzeLocally = async (demographics: UserDemographics, questions: Question[], answers: QuizAnswer[], language: Language = 'en'): Promise<MatchProfile> => {
    const scores = calculateScores(questions, answers, language);
    
    const hash = Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();

    let archetype = "The Harmonic Traveler";
    if (language === 'zh') archetype = "和谐的旅人";
    if (language === 'ja') archetype = "調和のとれた旅人";

    const result: MatchProfile = {
        soulId: `ID-${hash}`,
        summary: language === 'zh' ? "您的概况正在同步中..." : "Your profile is syncing...",
        mbtiType: archetype,
        scores: scores,
        idealPartner: {
            description: language === 'zh' ? "能理解你核心价值观的人" : "Someone who aligns with your core truth.",
            traits: language === 'zh' ? ["共情", "尊重", "成长"] : ["Empathy", "Respect", "Growth"],
            dealBreakers: language === 'zh' ? ["虚伪", "停滞"] : ["Dishonesty", "Stagnation"]
        },
        compatabilityAdvice: language === 'zh' ? "请连接网络以获取完整深度分析。" : "Connect to network for full deep analysis.",
        timestamp: Date.now(),
        history: { questions, answers }
    };

    await saveProfileToDatabase(result);
    return result;
};

export const analyzeProfile = async (
  demographics: UserDemographics,
  questions: Question[],
  answers: QuizAnswer[],
  language: Language = 'en'
): Promise<MatchProfile> => {
    
    // Create transcript from English questions (usually) but analysis is in target lang
    const transcript = questions
      .map(q => {
          const ans = answers.find(a => a.questionId === q.id);
          // Use master english text for consistency in prompt if possible, or just use current text
          return `[${q.dimension}] ${q.text.substring(0, 50)}... : Answer ${ans?.value}/5`;
      })
      .join('\n');

    // Robust Fallback if API key missing
    if (!apiKey) {
       return analyzeLocally(demographics, questions, answers, language);
    }

    const ai = new GoogleGenAI({ apiKey });

    // Schema without scores (we calculate them locally)
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        mbtiType: { type: Type.STRING, description: "A highly creative, metaphorical soul title (e.g. 'The Stardust Architect')" },
        idealPartner: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            traits: { type: Type.ARRAY, items: { type: Type.STRING } },
            dealBreakers: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        compatabilityAdvice: { type: Type.STRING }
      }
    };

    let langName = "English";
    if (language === 'zh') langName = "Simplified Chinese";
    if (language === 'ja') langName = "Japanese";

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", 
        contents: `You are a world-class relationship psychologist and data scientist.
        Analyze this person's 60-question profile to generate a "Soul Journey" report.
        
        Input Data:
        - Age/Gender/Interest: ${demographics.age}, ${demographics.gender}, ${demographics.interestedIn}.
        - Answers (1=Strongly Disagree, 5=Strongly Agree):
        ${transcript}

        Your Task is to create a profile that helps them understand themselves AND find a partner. 
        Balance "Soul/Poetic" depth with "Practical/Dating" advice.

        1. **Soul Title**: A poetic, abstract archetype.
        2. **Deep Summary**: A profound analysis of their inner contradictions and emotional landscape. Use metaphors but be grounded in their actual psychology.
        3. **Ideal Partner**:
           - **Description**: A paragraph describing the personality type that best complements them.
           - **Traits**: List 3-5 specific magnetic traits they should look for (e.g., "Emotional transparency", "Financial ambition").
           - **Dealbreakers**: List 3-5 traits they must avoid (e.g., "Passive aggression", "Rigidity").
        4. **Advice**: One specific, actionable piece of relationship advice to improve their connection with others.
        
        Output Language: ${langName} (Strictly output JSON values in ${langName}).
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text) as MatchProfile;
        
        // Calculate scores locally to guarantee chart data exists
        const calculatedScores = calculateScores(questions, answers, language);
        
        // Merge
        result.scores = calculatedScores;
        
        const hash = Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
        result.soulId = `ID-${hash}`;
        result.timestamp = Date.now();
        result.history = { questions, answers };
        
        await saveProfileToDatabase(result);
        return result;
      }
      throw new Error("Empty response");

    } catch (error) {
       console.log("Analysis unavailable (Quota or Error). Switching to offline mode.");
       return analyzeLocally(demographics, questions, answers, language);
    }
}
