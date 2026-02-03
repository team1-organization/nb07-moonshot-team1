import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        // 프로젝트 루트의 tests 폴더 내의 파일들만 테스트 대상으로 지정
        include: ['tests/**/*.{js,mjs,ts}'],
        exclude: ['node_modules', 'dist', 'generate'],
        // 환경 설정 (Node.js 백엔드이므로 node 권장)
        environment: 'node',
        setupFiles : ['./tests/setup.ts'],
        // 전역 변수 사용 설정 (test, expect 등을 import 없이 사용 가능)
        globals: true,
    },
});