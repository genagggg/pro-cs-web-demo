#!/bin/bash

# Проверка структуры проекта Pro CS Web Demo

echo "=== Проверка структуры проекта ==="
echo ""

echo "1. Корневая директория:"
ls -la

echo ""
echo "2. Package.json файлы:"
find . -name "package.json" -type f | sort

echo ""
echo "3. TypeScript файлы:"
find . -name "*.ts" -o -name "*.tsx" | sort | head -20

echo ""
echo "4. Webpack конфигурации:"
find . -name "webpack*.js" -type f | sort

echo ""
echo "5. Проверка основных директорий:"
for dir in host remote-radar remote-offers mock-server; do
    if [ -d "$dir" ]; then
        echo "✓ $dir существует"
        if [ -f "$dir/package.json" ]; then
            echo "  ✓ package.json существует"
        else
            echo "  ✗ package.json отсутствует"
        fi
        if [ -d "$dir/src" ]; then
            echo "  ✓ src/ существует"
        else
            echo "  ✗ src/ отсутствует"
        fi
    else
        echo "✗ $dir отсутствует"
    fi
done

echo ""
echo "6. Проверка tsconfig.json:"
if [ -f "tsconfig.json" ]; then
    echo "✓ tsconfig.json существует"
else
    echo "✗ tsconfig.json отсутствует"
fi

echo ""
echo "=== Проверка завершена ==="