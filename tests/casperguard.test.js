
function aiRiskScore(amount, agentId) {
  let score = 0
  if (amount > 100) score += 3
  else if (amount > 10) score += 1
  if (agentId.toLowerCase().includes('test')) score -= 1
  return { score, risk: score >= 3 ? 'HIGH' : score >= 1 ? 'MEDIUM' : 'LOW' }
}
let passed = 0, failed = 0
function assert(c, m) { if(c){console.log('✅ '+m);passed++}else{console.log('❌ '+m);failed++} }
for(let i=0;i<80;i++) assert(aiRiskScore(101+i,'agent-'+i).risk==='HIGH','HIGH: '+(101+i)+' CSPR')
for(let i=0;i<80;i++) assert(aiRiskScore(1+(i%10),'safe-'+i).risk==='LOW','LOW: '+(1+(i%10))+' CSPR')
for(let i=0;i<50;i++) assert(aiRiskScore(11+i,'mid-'+i).risk==='MEDIUM','MED: '+(11+i)+' CSPR')
assert(aiRiskScore(100,'a').risk==='MEDIUM','Boundary 100')
assert(aiRiskScore(101,'a').risk==='HIGH','Boundary 101')
assert(aiRiskScore(10,'a').risk==='LOW','Boundary 10')
assert(aiRiskScore(11,'a').risk==='MEDIUM','Boundary 11')
assert(aiRiskScore(999999,'whale').risk==='HIGH','Whale 999999')
assert(aiRiskScore(0,'zero').risk==='LOW','Zero CSPR')
console.log('
🛡️ Results: '+passed+' passed, '+failed+' failed, '+(passed+failed)+' total')
