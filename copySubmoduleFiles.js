const fs = require('fs');
const path = require('path');

const envPath  = '/Users/jangseohyeon/Documents/moim/backend/submodule/.env'; // 원본 경로
const destPath = '/Users/jangseohyeon/Documents/moim/backend/submodule/.env';; // 복사할 위치

// 원본과 대상이 같은지 확인 후 복사 방지
if (envPath === destPath) {
    console.warn('⚠️ 원본과 대상 경로가 동일합니다. 복사를 건너뜁니다.');
} else if (!fs.existsSync(envPath)) {
    console.warn(`⚠️ 경고: ${envPath} 파일이 존재하지 않습니다. .env 파일을 생성하거나 확인하세요.`);
} else {
    fs.copyFileSync(envPath, destPath);
    console.log('✅ .env 파일이 정상적으로 복사되었습니다.');
}

