#!/bin/bash

set -e  # 중간에 에러 발생하면 스크립트 중단

current_branch=$(git rev-parse --abbrev-ref HEAD)
stage_branch="stage"

echo "✅ 현재 브랜치: $current_branch"
echo "✅ stage 브랜치로 자동 배포를 시작합니다..."

# 변경사항 커밋
git add .
if ! git diff-index --quiet HEAD --; then
    git commit -m "🚀 stage 앱 배포 자동 커밋"
    echo "✅ 변경사항 커밋 완료"
else
    echo "ℹ️ 변경사항 없음, 커밋 생략"
fi

# stage 브랜치 새로 생성
git branch -D $stage_branch 2>/dev/null || true
git switch -c $stage_branch

# 강제 푸시
git push -f origin $stage_branch
echo "✅ stage 브랜치가 성공적으로 push 되었습니다."

# 원래 브랜치로 복귀
git checkout $current_branch
echo "🔙 원래 브랜치($current_branch)로 복귀 완료"
