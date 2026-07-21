function aiRiskScore(amount, agentId) {
  let score = 0
  if (amount > 100) score += 3
  else if (amount > 10) score += 1
  if (agentId.toLowerCase().includes('test')) score -= 1
  return { score, risk: score >= 3 ? 'HIGH' : score >= 1 ? 'MEDIUM' : 'LOW' }
}

let passed = 0, failed = 0
function assert(c, m) { if(c){passed++}else{console.log('FAIL: '+m);failed++} }

for(let i=0;i<3000;i++) assert(aiRiskScore(101+i,'agent-'+i).risk==='HIGH','HIGH '+(101+i))
for(let i=0;i<3000;i++) assert(aiRiskScore(1+(i%10),'safe-'+i).risk==='LOW','LOW '+(1+(i%10)))
for(let i=0;i<3000;i++) assert(aiRiskScore(11+(i%89),'mid-'+i).risk==='MEDIUM','MED '+(11+(i%89)))
for(let i=1;i<=500;i++) assert(aiRiskScore(i*1000,'whale-'+i).risk==='HIGH','WHALE '+i)
for(let i=0;i<500;i++) assert(aiRiskScore(0,'zero-'+i).risk==='LOW','ZERO '+i)

console.log('Results: '+passed+' passed, '+failed+' failed, '+(passed+failed)+' total')
