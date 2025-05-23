import React, { useState } from 'react';

// 音名リスト
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// チューニングプリセット
const TUNING_PRESETS: Record<string, string[]> = {
  "Standard (6弦)": ["E", "A", "D", "G", "B", "E"],
  "P4th (6弦)": ["E", "A", "D", "G", "C", "F"],
  "Drop D": ["D", "A", "D", "G", "B", "E"],
  "Open G": ["D", "G", "D", "G", "B", "D"],
  "7弦 Standard": ["B", "E", "A", "D", "G", "B", "E"],
  "8弦 Standard": ["F#", "B", "E", "A", "D", "G", "B", "E"],
  "オリジナル": [],
};

// コード構成音定義
const CHORDS: Record<string, number[]> = {
  "メジャー": [0, 4, 7],
  "マイナー": [0, 3, 7],
  "7th": [0, 4, 7, 10],
  "sus4": [0, 5, 7],
  "dim": [0, 3, 6],
  "aug": [0, 4, 8],
};

// スケール構成音定義
const SCALES: Record<string, number[]> = {
  "メジャースケール": [0, 2, 4, 5, 7, 9, 11],
  "ナチュラルマイナー": [0, 2, 3, 5, 7, 8, 10],
  "ペンタ（メジャー）": [0, 2, 4, 7, 9],
  "ブルース（マイナー）": [0, 3, 5, 6, 7, 10],
};

type DisplayMode = "コード" | "スケール";

// チューニング選択部品
function TuningSelector({
  tuning,
  setTuning,
  numStrings,
  setNumStrings,
}: {
  tuning: string[];
  setTuning: (tuning: string[]) => void;
  numStrings: number;
  setNumStrings: (n: number) => void;
}) {
  const [preset, setPreset] = useState("Standard (6弦)");

  // プリセット選択時
  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setPreset(val);
    if (TUNING_PRESETS[val].length) {
      setNumStrings(TUNING_PRESETS[val].length);
      setTuning([...TUNING_PRESETS[val]]);
    }
  };
  // 手動入力
  const handleManualChange = (idx: number, note: string) => {
    const newTuning = tuning.slice();
    newTuning[idx] = note;
    setTuning(newTuning);
  };

  return (
    <div style={{ margin: "1em 0" }}>
      <label>
        チューニング:
        <select value={preset} onChange={handlePresetChange}>
          {Object.keys(TUNING_PRESETS).map(p =>
            <option key={p} value={p}>{p}</option>
          )}
        </select>
      </label>
      {preset === "オリジナル" && (
        <span style={{ marginLeft: 16 }}>
          <label>
            弦数:
            <select
              value={numStrings}
              onChange={e => {
                setNumStrings(Number(e.target.value));
                setTuning(Array(Number(e.target.value)).fill("E"));
              }}>
              {[6, 7, 8].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        </span>
      )}
      <div>
        {Array(numStrings).fill(0).map((_, i) => (
          <select
            key={i}
            value={tuning[i] || "E"}
            onChange={e => handleManualChange(i, e.target.value)}
            style={{ width: 45, marginRight: 6 }}
          >
            {NOTE_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        ))}
        <span style={{ fontSize: 12, marginLeft: 8 }}>1弦 →（右）</span>
      </div>
    </div>
  );
}

// コード/スケール選択部品
function ModeSelector({
  mode,
  setMode,
  chordType,
  setChordType,
  scaleType,
  setScaleType,
  root,
  setRoot,
}: {
  mode: DisplayMode;
  setMode: (m: DisplayMode) => void;
  chordType: string;
  setChordType: (v: string) => void;
  scaleType: string;
  setScaleType: (v: string) => void;
  root: string;
  setRoot: (v: string) => void;
}) {
  return (
    <div style={{ margin: "1em 0" }}>
      <button
        onClick={() => setMode("コード")}
        style={{ fontWeight: mode === "コード" ? "bold" : undefined, marginRight: 8 }}
      >コード表示</button>
      <button
        onClick={() => setMode("スケール")}
        style={{ fontWeight: mode === "スケール" ? "bold" : undefined }}
      >スケール表示</button>
      <span style={{ marginLeft: 16 }}>
        Root:
        <select value={root} onChange={e => setRoot(e.target.value)} style={{ marginLeft: 4 }}>
          {NOTE_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </span>
      <span style={{ marginLeft: 12 }}>
        {mode === "コード" ? (
          <select value={chordType} onChange={e => setChordType(e.target.value)}>
            {Object.keys(CHORDS).map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        ) : (
          <select value={scaleType} onChange={e => setScaleType(e.target.value)}>
            {Object.keys(SCALES).map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        )}
      </span>
    </div>
  );
}

// 表示切替（インターバル/音名）
function MarkModeSelector({
  markMode,
  setMarkMode,
}: {
  markMode: "interval" | "note";
  setMarkMode: (m: "interval" | "note") => void;
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      <label>
        <input type="radio" checked={markMode === "interval"} onChange={() => setMarkMode("interval")} />
        インターバル
      </label>
      <label style={{ marginLeft: 12 }}>
        <input type="radio" checked={markMode === "note"} onChange={() => setMarkMode("note")} />
        音名
      </label>
    </div>
  );
}

// インターバル表記
const INTERVALS = ["R", "b2", "2", "b3", "3", "4", "b5", "5", "#5", "6", "b7", "7"];

// 指板可視化SVG（6弦が下、1弦が上になるよう逆順で描画）
function Fretboard({
  tuning,
  positions,
  markMode,
  numFrets = 12,
}: {
  tuning: string[];
  positions: (number | null)[][];
  markMode: "interval" | "note";
  numFrets?: number;
}) {
  const stringSpacing = 36;
  const fretSpacing = 34;
  const nutWidth = 38;
  const circleRadius = 13;

  const width = nutWidth + fretSpacing * numFrets + 18;
  const height = stringSpacing * (tuning.length - 1) + 50;

  // フレット番号表示位置
  function fretNumberX(fret: number) {
    return nutWidth + fretSpacing * fret + fretSpacing / 2;
  }

  // 下から6弦〜1弦となるように逆順で描画
  // s: 0=6弦（いちばん下）, s: num-1=1弦（いちばん上）

  const reversedTuning = [...tuning].reverse();
  const reversedPositions = [...positions].reverse();

  return (
    <svg width={width} height={height} style={{ background: "#fafafa" }}>
      {/* 弦 */}
      {reversedTuning.map((_, s) =>
        <line
          key={s}
          x1={nutWidth + fretSpacing * 1} // ← ここを1フレットからに
          y1={stringSpacing * s + 28}
          x2={width - 14}
          y2={stringSpacing * s + 28}
          stroke="#333"
          strokeWidth={2 - (s === 0 || s === tuning.length - 1 ? 0.6 : 0)}
        />
      )}
      {/* フレット */}
      {Array(numFrets + 1).fill(0).map((_, f) =>
        f === 0 ? null : ( // 0フレットは描画しない
        <line
          key={f}
          x1={nutWidth + fretSpacing * f}
          y1={26}
          x2={nutWidth + fretSpacing * f}
          y2={height - 22}
          stroke={f === 0 ? "#666" : "#aaa"}
          strokeWidth={f === 1 ? 6 : 2} // 1フレットだけ太く
        />
        )
      )}
      {/* フレット番号 */}
      {Array(numFrets).fill(0).map((_, f) =>
        <text
          key={f}
          x={fretNumberX(f)}
          y={height - 5}
          fontSize={12}
          fill="#666"
          textAnchor="middle"
        >{f}</text>
      )}
      {/* ポジションマーク */}
      {reversedPositions.map((frets, s) =>
        frets.map((pos, f) => pos !== null && (
          <g key={s + "-" + f}>
            <circle
              cx={nutWidth + fretSpacing * f + fretSpacing / 2}
              cy={stringSpacing * s + 28}
              r={circleRadius}
              fill="#2c9"
              stroke="#0b7"
              strokeWidth={2}
            />
            <text
              x={nutWidth + fretSpacing * f + fretSpacing / 2}
              y={stringSpacing * s + 34}
              fontSize={13}
              textAnchor="middle"
              fill="#184"
              fontWeight="bold"
            >
              {markMode === "interval"
                ? INTERVALS[pos % 12]
                : NOTE_NAMES[pos % 12]}
            </text>
          </g>
        ))
      )}
      {/* 弦名 */}
      {reversedTuning.map((note, s) =>
        <text
          key={s}
          x={28}
          y={stringSpacing * s + 34}
          fontSize={13}
          fill="#555"
          textAnchor="end"
        >{note}</text>
      )}
    </svg>
  );
}

// 全ポジション計算
function calcPositions(
  tuning: string[],
  numFrets: number,
  root: string,
  structure: number[],
): (number | null)[][] {
  // 各弦: 開放音の音高
  const baseNotes = tuning.map(n => NOTE_NAMES.indexOf(n));
  const rootIdx = NOTE_NAMES.indexOf(root);

  // 各弦 x 各フレット: 構成音 or null
  return baseNotes.map(base =>
    Array(numFrets).fill(null).map((_, fret) => {
      const note = (base + fret + 12) % 12;
      // 何度上がりか
      const intv = (note - rootIdx + 12) % 12;
      const idx = structure.indexOf(intv);
      return idx !== -1 ? intv : null;
    })
  );
}

export default function TuningVisualizer() {
  // ステート
  const [numStrings, setNumStrings] = useState(6);
  const [tuning, setTuning] = useState([...TUNING_PRESETS["Standard (6弦)"]]);
  const [mode, setMode] = useState<DisplayMode>("コード");
  const [chordType, setChordType] = useState("メジャー");
  const [scaleType, setScaleType] = useState("メジャースケール");
  const [root, setRoot] = useState("C");
  const [markMode, setMarkMode] = useState<"interval" | "note">("interval");

  // コード/スケール構成音
  const structure = mode === "コード"
    ? CHORDS[chordType]
    : SCALES[scaleType];

  const positions = calcPositions(tuning, 15, root, structure);

  return (
    <div>
      <h2>変則チューニング可視化ツール</h2>
      <ModeSelector
        mode={mode}
        setMode={setMode}
        chordType={chordType}
        setChordType={setChordType}
        scaleType={scaleType}
        setScaleType={setScaleType}
        root={root}
        setRoot={setRoot}
      />
      <MarkModeSelector markMode={markMode} setMarkMode={setMarkMode} />
      <Fretboard
        tuning={tuning}
        positions={positions}
        markMode={markMode}
        numFrets={15}
      />
      <TuningSelector
        tuning={tuning}
        setTuning={setTuning}
        numStrings={numStrings}
        setNumStrings={setNumStrings}
      />
      <div style={{ fontSize: 12, marginTop: 16, color: "#666" }}>
        © 2025 変則チューニング可視化ツール MVP
      </div>
    </div>
  );
}
