// Kiểm tra mọi chuỗi t('...') trong src/ đều có bản dịch đủ 4 ngôn ngữ (en, ko, ja, zh).
// Chạy: npm run kiem-tra-dich   (thoát mã 1 nếu thiếu → dùng được trong CI)
import { execSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import ts from 'typescript'

const goc = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
execSync('npx esbuild src/i18n/ban-dich/index.ts --bundle --format=cjs --outfile=.tmp-ban-dich.cjs --log-level=error', { cwd: goc, stdio: 'inherit' })
const BAN_DICH = createRequire(import.meta.url)(join(goc, '.tmp-ban-dich.cjs')).BAN_DICH

const duyet = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? duyet(join(d, e.name)) : [join(d, e.name)]))
const thieu = new Map()
for (const f of duyet(join(goc, 'src')).filter((f) => /\.(ts|tsx)$/.test(f) && !/[\\/]i18n[\\/]/.test(f))) {
  const sf = ts.createSourceFile(f, readFileSync(f, 'utf8'), ts.ScriptTarget.Latest, true, f.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS)
  const ghe = (n) => {
    if (ts.isCallExpression(n) && n.expression.getText() === 't' && n.arguments[0] && (ts.isStringLiteral(n.arguments[0]) || ts.isNoSubstitutionTemplateLiteral(n.arguments[0]))) {
      const k = n.arguments[0].text
      const m = BAN_DICH[k]
      if (!m || m.length !== 4 || m.some((x) => !x)) thieu.set(k, f.replace(goc, ''))
    }
    ts.forEachChild(n, ghe)
  }
  ghe(sf)
}
execSync('node -e "require(\'fs\').rmSync(\'.tmp-ban-dich.cjs\',{force:true})"', { cwd: goc })
if (thieu.size) {
  console.error(`Thiếu bản dịch cho ${thieu.size} chuỗi:`)
  for (const [k, f] of thieu) console.error(`  [${f}] ${k}`)
  process.exit(1)
}
console.log(`OK: ${Object.keys(BAN_DICH).length} mục dịch, không thiếu chuỗi nào.`)
