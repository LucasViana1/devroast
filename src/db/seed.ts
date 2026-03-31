import "dotenv/config";
import { db, roastFindings, roasts, submissions } from "./index";

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "rust",
  "go",
  "java",
  "csharp",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "sql",
  "html",
  "css",
  "shell",
] as const;

const CODE_TEMPLATES: Record<(typeof LANGUAGES)[number], string[]> = {
  javascript: [
    "function add(a,b){return a+b;}",
    "const x=await fetch('/api/data');const y=await x.json();console.log(y);",
    "arr.map(i=>i*2).filter(i=>i>10).reduce((a,b)=>a+b,0);",
    `async function fetchUser(id){const res=await fetch(\`/users/\${id}\`);return res.json();}`,
  ],
  typescript: [
    "function add(a:number,b:number):number{return a+b;}",
    "interface User{id:number;name:string;email:string;}const user:User={id:1,name:'test',email:'test@test.com'};",
    "type Result<T>=T extends Error?never:T;",
    "const handler=(event:MouseEvent)=>{console.log(event.clientX);};",
  ],
  python: [
    "def add(a,b):return a+b",
    "for i in range(10):print(i**2)",
    "with open('file.txt','r')as f:data=f.read()",
    "class User:def __init__(self,name):self.name=name",
  ],
  rust: [
    "fn add(a:i32,b:i32)->i32{a+b}",
    "let mut v=vec![1,2,3];v.push(4);",
    'pub fn main(){println!("{:?}",Some(42));}',
    'match value{Ok(x)=>println!("{}",x),Err(e)=>eprintln!("{}",e)}',
  ],
  go: [
    "func add(a,b int)int{return a+b}",
    "if err!=nil{log.Fatal(err)}",
    "go func(){ch<-1}()",
    'type User struct{Name string `json:"name"`}',
  ],
  java: [
    "public int add(int a,int b){return a+b;}",
    "List<String>list=new ArrayList<>();",
    "public class Main{public static void main(String[]args){}}",
    "try{Thread.sleep(1000);}catch(InterruptedException e){e.printStackTrace();}",
  ],
  csharp: [
    "public int Add(int a,int b)=>a+b;",
    "var result=List<int>().Where(x=>x>0).Sum();",
    "public async Task<User>GetUserAsync(int id){var user=await _context.Users.FindAsync(id);return user;}",
    "using(var conn=new SqlConnection(connString)){conn.Open();}",
  ],
  ruby: [
    "def add(a,b);a+b;end",
    "arr.map{|x|x*2}.compact.join(',')",
    "class User<ApplicationRecord;end",
    "before_action:set_user,only:[:show,:edit]",
  ],
  php: [
    "function add($a,$b){return$a+$b;}",
    "foreach($users as$user){echo$user['name'];}",
    '$result=mysqli_query($conn,"SELECT*FROM users");',
    "public function index(){return view('home',['data'=>$data]);}",
  ],
  swift: [
    "func add(_ a:Int,_ b:Int)->Int{a+b}",
    "let result=array.filter{$0>0}.map{$0*2}",
    "guard let user=try?context.fetch(User.self).first else{return}",
    "@State private var isLoading=false",
  ],
  kotlin: [
    "fun add(a:Int,b:Int)=a+b",
    "val result=list.filter{it>0}.sum()",
    "suspend fun fetchData():Result<Data>=try{Success(api.get())}catch(e:Exception){Error(e)}",
    "inner class ViewHolder(itemView:View):RecyclerView.ViewHolder(itemView)",
  ],
  sql: [
    "SELECT*FROM users WHERE active=true ORDER BY created_at DESC",
    "INSERT INTO logs(user_id,action)VALUES(1,'login')",
    "UPDATE products SET price=price*0.9 WHERE stock>100",
    "SELECT u.name,COUNT(o.id)FROM users u LEFT JOIN orders o ON u.id=o.user_id GROUP BY u.id",
  ],
  html: [
    "<div class='container'><h1>Title</h1><p>Content</p></div>",
    "<img src='image.jpg' alt='desc'onclick='alert(1)'>",
    "<a href='http://example.com' target='_blank'>Link</a>",
    "<table><tr><td>Data</td></tr></table>",
  ],
  css: [
    ".container{display:flex;justify-content:center;}",
    "body{margin:0;padding:0;font-family:Arial,sans-serif;}",
    ".btn{background:#000;color:#fff;padding:10px;border:none;}",
    "@media(max-width:768px){.container{flex-direction:column;}}",
  ],
  shell: [
    "for f in*.txt;do echo$f;done",
    'curl -X POST https://api.example.com/data -d \'{"key":"value"}\'',
    "grep -r 'TODO' ./src||echo 'No todos found'",
    "npm install&&npm run build&&npm start",
  ],
};

const LONG_CODE_5_LINES = `const express = require('express');
const app = express();
app.use(express.json());
app.get('/api/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users');
  res.json(users);
});`;

const LONG_CODE_10_LINES = `function processData(data) {
  if (!data) return null;
  const result = [];
  for (const item of data) {
    if (item.active) {
      const transformed = {
        id: item.id,
        name: item.name.toUpperCase(),
        email: item.email || 'unknown',
        created: new Date(item.createdAt),
        status: item.active ? 'active' : 'inactive'
      };
      result.push(transformed);
    }
  }
  return result.sort((a, b) => a.name.localeCompare(b.name));
}`;

const LONG_CODES = [
  `function processData(data) {
  if (!data) return null;
  const result = [];
  for (const item of data) {
    if (item.active) {
      const transformed = {
        id: item.id,
        name: item.name.toUpperCase(),
        email: item.email || 'unknown'
      };
      result.push(transformed);
    }
  }
  return result;
}`,
  `const express = require('express');
const app = express();
app.use(express.json());
app.get('/api/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users');
  res.json(users);
});`,
  `def process_items(items):
    result = []
    for item in items:
        if item['active']:
            processed = {
                'id': item['id'],
                'name': item['name'].upper(),
                'value': item.get('value', 0)
            }
            result.append(processed)
    return result`,
  `async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.map(item => ({
      id: item.id,
      name: item.name,
      status: 'active'
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}`,
  `class DataProcessor {
  process(items) {
    return items
      .filter(i => i.active)
      .map(i => ({
        id: i.id,
        name: i.name.toUpperCase()
      }));
  }
}`,
  `const handleRequest = (req, res) => {
  const { id, type } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing id' });
  }
  const data = database.getById(id);
  res.json(data);
};`,
  `def calculate_metrics(data):
    total = 0
    count = 0
    for item in data:
        if item.get('active'):
            total += item.get('value', 0)
            count += 1
    return total / count if count > 0 else 0`,
  `function transform(input) {
  const output = [];
  for (let i = 0; i < input.length; i++) {
    const item = input[i];
    if (item.enabled) {
      output.push({
        key: item.key,
        value: item.value,
        timestamp: Date.now()
      });
    }
  }
  return output;
}`,
  `const processUsers = (users) => {
  return users
    .filter(user => user.isActive)
    .map(user => ({
      id: user.id,
      name: user.name,
      email: user.email
    }));
};`,
  `async function loadData() {
  const response = await fetch('/api/data');
  const json = await response.json();
  return json.filter(item => item.active);
}`,
];

const ROAST_FEEDBACKS = [
  "Este código parece ter sido escrito às 3 da manhã após 12 xícaras de café. Não que eu esteja julgando.",
  "Imagino que você tenha escrito isso com os olhos fechados. Talvez literalmente, considerando a indentação.",
  " parabéns, você conseguiu fazer o código funcionar. Infelizmente, parece que foi por acidente.",
  "Se eu tivesse um real para cada vez que vi algo assim, poderia me aposentar. Ah, espere, isso é problema seu.",
  "Olha, eu entendo que deadlines são estressantes, mas isso aqui... isso é arte abstrata.",
  "O nome dessa variável é 'x'. Muito criativo. Vou nomear meu próximo filho assim.",
  "Seu código compila? Compila. Funciona? ...Vamos não nos precipitar.",
  "Parabéns, você descobriu como fazer um loop infinito. Quer um prêmio?",
  "Esse comentário explicando o código não deveria existir. Se o código precisa de comentário, está mal escrito.",
  "A complexidade ciclomática desse código provavelmente quebra a tela do meu monitor.",
  "Você sabia que existe uma coisa chamada 'função'? Parece algo que você deveria explorar.",
  "Eu odiaria estar na equipe de manutenção desse código. Oh espera, agora sou eu.",
  "Mais níveis de aninhamento do que um sonho de Inception. Você consegue ver o fundo?",
  "Esse código está tão acoplado que parece estar usando elastico de cabelo para se manter junto.",
  "Parabéns, você reinventou a roda. Só que quadrada.",
  "Não sei o que essa linha faz, mas certeza que não deveria estar fazendo isso.",
  "Tentativa numero... não importa. O git log sabe.",
  "Se tivesse写得 mais documentação, até eu conseguiria entender.",
  "Parabéns, você fez trabalho de verdade. Infelizmente, não trabalho de qualidade.",
  "Esse código tem mais bugs que um hotel cinqüenta estrelas.",
  "Quando eu disse 'clean code', não quis dizer isso. Ninguém quis dizer isso.",
  "Você treatou o codebase como se fosse um arquivo .txt gigante. Eu also.",
  "Não há 'try' sem 'catch'? Nesse código, nem há 'try'.",
  "Isso não é um código, é um testamento. De frustação.",
  "Continue assim e logo você sera promovido a 'senior one-line-function-writer'.",
  "A única coisa pior que esse código seria escrever o documentação do mesmo.",
  "Se 'any' fosse a resposta, esse código teria 100% de acerto.",
  "Você sabe que o TypeScript tem tipos, certo? Eles são bons.",
  "A indentação desse arquivo é mais inconsistente que o humor de umdeveloper de sexta à tarde.",
  "Tem mais 'console.log' aqui do que lógica de negócio. É um logging disfarçado.",
  "Esse merge conflict resolution foi tão bem feito quanto uma guerra religiosa.",
  "Código sem testes é só uma lista de promessas não cumpridas.",
  "Mais dependências do que neurônios em uma decisão архитектурная.",
  "O nome desse arquivo nao reflete seu conteudo. Nem o nome do projeto reflete a dor.",
  "Parabéns, você fez o sistema funcionar. Quebra na produção amanhã.",
  "Se eu pudesse dar um 'unlike' no GitHub, esse repo teria likes negativos.",
  "Esse código é tão macarrônico que até os Italians estão confusos.",
  "A função faz muito. O nome não diz nada. O mundo não é justo.",
  "Você realmente precisa desse arquivo .gitignore.local.bkp.final.v2.OLD?",
  "Menos comentarios, mais legibilidade. Ou mais comentarios, qualquer coisa.",
  "O schema do banco tem mais relações do que a vida social do seu ORM.",
  "Dessa vez, pelo menos, não tem 'DROP TABLE' no código. Peque vitória.",
  "Os testes estão commented-out? Isso é confiança ou medo?",
  "Quebra de linha no meio de uma string? Ooo, ousado.",
  "Esse código deveria estar em produção? R: Não.",
  "O linter não roda? Não é linter, é você. Desculpa.",
  "Mais magic numbers do que em um show de mágica.",
  "Parabéns, você encontrou um atalho. Quebra em produção. Bom trabalho.",
  "Os testes passaram? Passaram. Não testam nada. Isso é triste.",
  "Esse import não utilizado? É decoração, eu acho.",
  "A complexidade de leitura desse código é maior que a de um paper acadêmico.",
  "Parabéns, você não usou 'var'. Isso ja é alguma coisa.",
  "Arrow functions everywhere! O mercado vai notar sua consistência.",
  "Não sei o que isso faz, mas 'assume it's correct' porque o CI passou.",
  "Esse nome de variável 'temp2' me diz muito. Não diz nada. Como esperado.",
  "Menos 'as any' e mais carinho com o TypeScript. Por favor.",
  "O código tem mais 'TODO' que funcionalidades implementadas.",
  "Parabéns, você evitou usar jQuery. Mais uma vitória para o bem.",
  "Se o código tivesse que pagar aluguel, já teria sido despejado.",
  "A arquitetura de pastas é um misterio para os mortais.",
  "Não existe documentação? O README? Isso é um crime. Código sem docs é furto.",
  "Esse sleep no código? Isso é um sintoma, não uma cura.",
  "Falta de обработка ошибок está me deixando смущенный.",
  "Mais níveis de callbacks do que um callbackheck de chamada de volta.",
  "Esse código foi claramente escrito por alguém que pensou que 'funciona' era suficiente.",
  "A cor do tema é 'roxo neon com gradiente'. Isso explica muita coisa.",
  "Parabéns, você não inverteu a verificação de null. Pequena vitória.",
  "Esse código tem mais switches do que um telejornal de madrugada.",
  "Os testes unitarios estão testando o que não deveria ser testado. Meta.",
  "Mais regex nesse código do que em uma luta de expresiones regulares.",
  "A função tem 500 linhas. O nome? 'processData'. Claro.",
  "Parabéns, você conseguiu fazer o código funcionar com globals. Estável como sempre.",
  "Esse código não passa no ESLint. Nenhum arquivo passa. O universo implode.",
  "Se a gente cobrasse por cada 'TODO', esse projeto era bilionário.",
  "A API endpoint naming está tão inconsistente quanto a energia de um developer de segunda.",
  "Esse código é tão procedural que parece um script de filme старый.",
  "Ninguém sabe o que esse helper faz. Ninguém pergunta. Medo.",
  "O CSS specificity desse projeto poderia ser tema de tese de doutorado.",
  "Parabéns, você não usou 'eval'. Isso é BASIC CODE HYGIENE 101.",
  "Os logs estão em PT-BR. Os erros em EN. A cultura de debug é uma bagunça.",
  "Esse arquivo tem mais linhas comentadas que código ativo. Museu do código.",
  "A complexidade de читаемость é baixa. Isso não é bom.",
  "O deploy pipeline tem mais steps do que uma receita de bolo de laranja.",
  "Parabéns, você separou as responsabilidades. Erradas, mas separou.",
  "Esse código não tem types. É 2024. Fica FEITO.",
  "As validações são client-side only. Isso é um presente para hackers.",
  "O rate limiting não existe. O server vai amar você.",
  "As variáveis tem nome de pessoa. 'ze', 'maria', 'joao'. Comunidade.",
  "Se você precisasse de uma variável pra cada coisa, esse código teria milhões.",
  "Parabéns, você descobriu o '||'. Infelizmente, abusou.",
  "O design pattern usado? 'Big Ball of Mud'. Classic.",
  "Não há nada de errado com isso. NADA. Eu só não gosto de você.",
  "A indentação foi feita por alguém que pensa que tabs são espaços. Ou vice-versa.",
  "Mais promises encadeadas do que numa fila de banco.",
  "O código deveria ter testes. Eu deveria ter uma vida. Não temos nenhum dos dois.",
];

const HONEST_FEEDBACKS = [
  "Este código está bem escrito. A estrutura está clara e fácil de seguir.",
  "Boa implementação! Os nomes das variáveis são descritivos.",
  "Ótimo uso de tipagem forte. Facilita a manutenção futura.",
  "O código está limpo e bem organizado. Bom trabalho!",
  "Parabéns pela consistência no estilo. Isso facilita a leitura.",
  "Código legível e bem documentado. Continue assim!",
  "Boa separação de responsabilidades. Facilita os testes.",
  "Os nomes das funções são claros e indicam bem o propósito.",
  "Ótima estrutura de dados. Bem escolhido o tipo correto.",
  "Parabéns por usar boas práticas de segurança desde o início.",
  "Código bem modularizado. Cada função faz uma coisa só.",
  "Ótimo tratamento de erros. Considerou vários casos.",
  "Boa performance. Evitou work desnecessário.",
  "Os testes cobrem bem os casos críticos. Continue expandindo.",
  "Parabéns por seguir as convenções do time. Isso ajuda todos.",
  "A documentação está atualizada e clara. Bom trabalho!",
  "Uso inteligente de abstrações. Não reinventou a roda.",
  "Código bem comentado. Facilita onboarding de novos devs.",
  "Parabéns por manter o código simples onde possível.",
  "A lógica está bem pensada. Considerou edge cases.",
];

const FINDING_MESSAGES: Record<string, { message: string; suggestion?: string }[]> = {
  javascript: [
    {
      message: "Variável 'x' sem contexto. Use nomes descritivos.",
      suggestion: "Renomeie para 'userData' ou 'responsePayload'",
    },
    {
      message: "Callback hell detectado. Considere usar Promises ou async/await.",
      suggestion: "Refatore com async function e try/catch",
    },
    {
      message: "Console.log em produção. Remova ou substitua por logger.",
      suggestion: "Use um logger como winston ou pino",
    },
    {
      message: "Variável não utilizada detectada.",
      suggestion: "Remova ou exports para uso futuro",
    },
    {
      message: "Possible null reference. Adicione verificação.",
      suggestion: "Use optional chaining: data?.prop",
    },
  ],
  typescript: [
    {
      message: "Tipo 'any' usado. Evite para melhor type safety.",
      suggestion: "Defina uma interface ou tipo específico",
    },
    {
      message: "Propriedade não verificada. Adicione validação.",
      suggestion: "Use guards ou validação de schema",
    },
    {
      message: "Type assertion perigoso. Considere type guard.",
      suggestion: "Implemente custom type guard function",
    },
    { message: "Parâmetro não tipado encontrado.", suggestion: "Adicione tipagem explícita" },
    {
      message: "Possível uso de tipo genérico ao invés de 'any'.",
      suggestion: "Considere usar generics<T>",
    },
  ],
  python: [
    { message: "Variável não utilizada encontrada.", suggestion: "Remova para limpar o código" },
    {
      message: "Loop pode ser otimizado com list comprehension.",
      suggestion: "[f(x) for x in items if condition]",
    },
    {
      message: "Try/except genérico. Capture exceções específicas.",
      suggestion: "Use except SpecificError:",
    },
    {
      message: "Import não utilizado detectado.",
      suggestion: "Remova ou mova para local adequado",
    },
    {
      message: "Docstring ausente em função pública.",
      suggestion: "Adicione docstring descrevendo propósito",
    },
  ],
  rust: [
    {
      message: "Clone desnecessário. Considere usar referência.",
      suggestion: "Passe &T ao invés de T.clone()",
    },
    {
      message: "unwrap() usado. Considere tratamento de erro.",
      suggestion: "Use ? operator ou match",
    },
    {
      message: "Loop pode usar iterador de forma mais idiomatic.",
      suggestion: "collection.iter().map(...).collect()",
    },
    {
      message: "Possível owned value desnecessário.",
      suggestion: "Use &str ao invés de String quando possível",
    },
  ],
  go: [
    {
      message: "Error não tratado. Adicione verificação.",
      suggestion: "if err != nil { return err }",
    },
    {
      message: "fmt.Println em produção. Use logging adequado.",
      suggestion: "log.Info, log.Error ou pacote estruturado",
    },
    {
      message: "Variável não utilizada. Remova ou use _",
      suggestion: "Use _ para ignorar valores de retorno",
    },
    {
      message: "String literal pode ser constante.",
      suggestion: "Defina como const no topo do arquivo",
    },
  ],
  java: [
    {
      message: "NullPointerException possível. Adicione null check.",
      suggestion: "Use Objects.requireNonNull() ou Optional",
    },
    {
      message: "Loop tradicional pode ser stream.",
      suggestion: "Use streams com map/filter/collect",
    },
    {
      message: "Catch genérico Exception. Seja específico.",
      suggestion: "Capture exceções específicas",
    },
    {
      message: "Campo público exposto. Encapsule.",
      suggestion: "Use getters/setters ou propriedades",
    },
  ],
  csharp: [
    { message: "await em contexto não-assíncrono.", suggestion: "Marque método como async Task" },
    {
      message: "Disposable não disposto. Use using statement.",
      suggestion: "using(var conn = new SqlConnection()) {...}",
    },
    {
      message: "LINQ pode ser simplificado.",
      suggestion: "Considere method syntax vs query syntax",
    },
    { message: "String interpolation disponível.", suggestion: 'Use $"Hello {name}"' },
  ],
  ruby: [
    { message: "Código duplicado detectado.", suggestion: "Extraia para método ou partial" },
    {
      message: "Indentation inconsistente. Use espaços padronizados.",
      suggestion: "Configure editor para 2 espaços",
    },
    { message: "Variável não referenciada após atribuição.", suggestion: "Remova ou use valor" },
    {
      message: "Método muito longo. Extraia para partes menores.",
      suggestion: "Cada método deve ter < 20 linhas",
    },
  ],
  php: [
    { message: "Variáveis não verificadas.", suggestion: "Use isset() ou empty() antes de usar" },
    {
      message: "SQL injection possível. Use prepared statements.",
      suggestion: "Use PDO ou mysqli com prepared statements",
    },
    {
      message: "Echo ao invés de return em método.",
      suggestion: "Retorne string, deixe view formatar",
    },
    {
      message: "Código legado detectado. Atualize para PSR-12.",
      suggestion: "Reformatar com phpcbf ou manualmente",
    },
  ],
  swift: [
    {
      message: "Force unwrap encontrado. Use guard let.",
      suggestion: "guard let value = optional else { return }",
    },
    {
      message: "AnyObject usado. Prefira protocolo ou tipo específico.",
      suggestion: "Defina protocolo ou use generics",
    },
    {
      message: "Main thread update detectado em background.",
      suggestion: "DispatchQueue.main.async {...}",
    },
    { message: "Strong reference cycle possível.", suggestion: "Use [weak self] em closures" },
  ],
  kotlin: [
    { message: "Null safety violada.", suggestion: "Use operadores ?., ?: ou let" },
    { message: "Any usado. Use tipo específico.", suggestion: "Defina data class ou sealed class" },
    {
      message: " mutableListOf usado. Considere imutável.",
      suggestion: "Use listOf() para.collections imutáveis",
    },
    { message: "runBlocking em produção.", suggestion: "Use suspend functions e coroutines" },
  ],
  sql: [
    { message: "SELECT * usado. Specify columns.", suggestion: "Liste apenas colunas necessárias" },
    {
      message: "Possible SQL injection. Use parameterized queries.",
      suggestion: "USE ? placeholders em vez de concatenação",
    },
    {
      message: "N+1 query problem. Considere JOIN.",
      suggestion: "Use JOIN ou subquery para buscar relacionados",
    },
    { message: "Index não usado em WHERE.", suggestion: "Verifique se há índice ou crie um" },
  ],
  html: [
    {
      message: "Alt text ausente em imagem.",
      suggestion: 'Adicione alt="descrição" para acessibilidade',
    },
    { message: "Tag não fechada detectada.", suggestion: "Feche todas as tags corretamente" },
    {
      message: "Inline style encontrado. Use CSS externo.",
      suggestion: "Mova estilos para classes CSS",
    },
    {
      message: "onclick em HTML. Separe comportamento.",
      suggestion: "Use addEventListener em JS externo",
    },
  ],
  css: [
    {
      message: "!important usado. Evite se possível.",
      suggestion: "Use especificidade adequada ou reorganize",
    },
    {
      message: "Unidades absolutas (px) em layout responsivo.",
      suggestion: "Use rem, em ou % para flexibilidade",
    },
    { message: "Duplicação de propriedades.", suggestion: "Consolide regras ou use herança" },
    { message: "Seletor muito específico.", suggestion: "Simplifique para melhor manutenção" },
  ],
  shell: [
    { message: "Exit code não verificado.", suggestion: "Verifique $? após comando" },
    {
      message: "String não citada. Problemas com espaços.",
      suggestion: 'Sempre cite: "$variable"',
    },
    {
      message: "Command injection possível.",
      suggestion: "Valide entrada antes de usar em command",
    },
    {
      message: "Hardcoded path. Use $PATH ou relativas.",
      suggestion: "Use which ou caminhos relativos",
    },
  ],
};

function randomChoice<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomChoices<T>(arr: readonly T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateScore(severity: string): number {
  switch (severity) {
    case "critical":
      return Math.round((0.5 + Math.random() * 1.5) * 10);
    case "error":
      return Math.round((2.0 + Math.random() * 2.0) * 10);
    case "warning":
      return Math.round((4.0 + Math.random() * 2.5) * 10);
    case "info":
      return Math.round((6.5 + Math.random() * 3.0) * 10);
    default:
      return Math.round((4.0 + Math.random() * 2.0) * 10);
  }
}

async function seed() {
  console.log("🌱 Starting seed...\n");

  console.log("🗑️  Clearing existing data...");
  await db.delete(roastFindings);
  await db.delete(roasts);
  await db.delete(submissions);
  console.log("✅ Data cleared\n");

  const ROAST_COUNT = 100;
  const roastIds: string[] = [];

  console.log(`📝 Generating ${ROAST_COUNT} submissions with roasts...`);

  for (let i = 0; i < ROAST_COUNT; i++) {
    const language = randomChoice(LANGUAGES);
    const roastMode = "roast";

    let code: string;
    let score: number;
    let severity: "info" | "warning" | "error" | "critical";

    if (i < 10) {
      code = randomChoice(LONG_CODES);
      const lowScores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      score = lowScores[i];
      severity = "critical";
    } else {
      const codeTemplates = CODE_TEMPLATES[language];
      code = randomChoice(codeTemplates);
      severity = randomChoice(["info", "warning", "error", "critical"] as const);
      score = generateScore(severity);
    }

    const [submission] = await db
      .insert(submissions)
      .values({
        code,
        language,
        roastMode,
      })
      .returning();

    const verdict = randomChoice(["good", "warning", "error"] as const);
    const feedbackPool = ROAST_FEEDBACKS;
    const feedback = randomChoice(feedbackPool);

    const [roast] = await db
      .insert(roasts)
      .values({
        submissionId: submission.id,
        verdict,
        severity,
        score,
        feedback,
      })
      .returning();

    roastIds.push(roast.id);

    if ((i + 1) % 20 === 0) {
      console.log(`  ✓ ${i + 1}/${ROAST_COUNT} roasts created`);
    }
  }

  console.log(`\n🔍 Generating roast findings for ${ROAST_COUNT} roasts...`);

  let totalFindings = 0;

  for (let i = 0; i < roastIds.length; i++) {
    const roastId = roastIds[i];
    const language = randomChoice(LANGUAGES);
    const findingTemplates = FINDING_MESSAGES[language] || FINDING_MESSAGES.javascript;
    const findingCount = Math.floor(Math.random() * 5) + 1;

    const findingsToInsert = randomChoices(findingTemplates, findingCount).map((finding) => ({
      roastId,
      severity: randomChoice(["info", "warning", "error", "critical"] as const),
      line: Math.floor(Math.random() * 50) + 1,
      message: finding.message,
      suggestion: finding.suggestion,
    }));

    await db.insert(roastFindings).values(findingsToInsert);
    totalFindings += findingsToInsert.length;

    if ((i + 1) % 20 === 0) {
      console.log(`  ✓ ${i + 1}/${ROAST_COUNT} roasts with findings`);
    }
  }

  console.log(`\n✅ Seed completed!`);
  console.log(`   📊 ${ROAST_COUNT} submissions`);
  console.log(`   🍖 ${ROAST_COUNT} roasts`);
  console.log(`   🔍 ${totalFindings} roast findings`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
