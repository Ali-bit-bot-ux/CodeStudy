/* ==========================================================================
   CodeStudy. // ACADEMY - Interactive IDE & Code Runner Component
   ========================================================================== */

const snippets = {
  python: {
    filename: "workspace // game_core.py",
    output: "✓ [Python 3.11] Player spawned! HP: 100, Speed: 16. Game loop active.",
    code: `import random
from dataclasses import dataclass

@dataclass
class Hero:
    name: str = "CyberKnight"
    health: int = 100
    level: int = 1
    coins: int = 0

    def collect_crystal(self, amount: int):
        self.coins += amount
        print(f"Collected {amount} crystals! Total: {self.coins}")

hero = Hero()
hero.collect_crystal(25)`
  },
  lua: {
    filename: "workspace // roblox_jump.lua",
    output: "✓ [Roblox Engine] TouchEvent connected! Trampoline jump impulse: 85.",
    code: `local part = script.Parent
local debounce = false

local function onTouched(hit)
    local character = hit.Parent
    local humanoid = character:FindFirstChild("Humanoid")
    
    if humanoid and not debounce then
        debounce = true
        humanoid.JumpPower = 85
        humanoid.Jump = true
        task.wait(1.5)
        humanoid.JumpPower = 50
        debounce = false
    end
end

part.Touched:Connect(onTouched)`
  },
  cpp: {
    filename: "workspace // olympiad_algo.cpp",
    output: "✓ [C++20 GCC] Binary search complete. Target 42 found at index: 7.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int binarySearch(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`
  }
};

function highlightCode(rawCode, lang) {
  const lines = rawCode.split('\n');
  return lines.map((line, idx) => {
    let formatted = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Basic syntax keywords
    if (lang === 'python') {
      formatted = formatted
        .replace(/\b(import|from|class|def|return|if|else)\b/g, '<span class="syn-kw">$1</span>')
        .replace(/\b(self)\b/g, '<span class="syn-self">$1</span>')
        .replace(/\b(int|str|dataclass|print)\b/g, '<span class="syn-fn">$1</span>')
        .replace(/(".*?")/g, '<span class="syn-str">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="syn-num">$1</span>');
    } else if (lang === 'lua') {
      formatted = formatted
        .replace(/\b(local|function|end|if|then|not)\b/g, '<span class="syn-kw">$1</span>')
        .replace(/\b(script|Parent|FindFirstChild|Connect|wait)\b/g, '<span class="syn-fn">$1</span>')
        .replace(/(".*?")/g, '<span class="syn-str">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="syn-num">$1</span>');
    } else if (lang === 'cpp') {
      formatted = formatted
        .replace(/\b(#include|using|namespace|int|const|while|return|if|else)\b/g, '<span class="syn-kw">$1</span>')
        .replace(/\b(vector|cout|endl)\b/g, '<span class="syn-fn">$1</span>')
        .replace(/(&lt;.*?&gt;)/g, '<span class="syn-str">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="syn-num">$1</span>');
    }

    return `<div class="code-line"><span class="code-num">${idx + 1}</span><span>${formatted}</span></div>`;
  }).join('');
}

let currentLang = 'python';

function initCodeIDE() {
  const tabs = document.querySelectorAll('.ide-tab');
  const codeBody = document.getElementById('ide-code-body');
  const consoleOutput = document.getElementById('ide-console-output');
  const runBtn = document.getElementById('ide-run-btn');

  if (!codeBody) return;

  function render(lang) {
    currentLang = lang;
    const data = snippets[lang];
    codeBody.innerHTML = highlightCode(data.code, lang);
    if (consoleOutput) {
      consoleOutput.innerHTML = `<span style="color:#10B981;">▶</span> <span>Код готов к запуску. Нажмите «Запустить»</span>`;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const lang = tab.getAttribute('data-lang');
      render(lang);
    });
  });

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      const data = snippets[currentLang];
      if (consoleOutput) {
        consoleOutput.innerHTML = `<span style="color:#F59E0B;">⚡</span> <span style="color:#F8FAFC;">Выполняется...</span>`;
        setTimeout(() => {
          consoleOutput.innerHTML = `<span style="color:#10B981;">●</span> <span>${data.output}</span>`;
        }, 350);
      }
    });
  }

  render('python');
}

document.addEventListener('DOMContentLoaded', initCodeIDE);
