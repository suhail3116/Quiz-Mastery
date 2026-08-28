import React, { useState, useEffect } from 'react';

export function QuestionModal({ isOpen, onClose, onSave, editingQuestion, basePoints = 10, passPoints = 5 }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctIndex, setCorrectIndex] = useState(0);
  const [points, setPoints] = useState(basePoints);
  const [passPts, setPassPts] = useState(passPoints);
  const [customTime, setCustomTime] = useState('');
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    if (editingQuestion) {
      setText(editingQuestion.text || '');
      setCategory(editingQuestion.category || '');
      setOpt0(editingQuestion.options?.[0] || '');
      setOpt1(editingQuestion.options?.[1] || '');
      setOpt2(editingQuestion.options?.[2] || '');
      setOpt3(editingQuestion.options?.[3] || '');
      setCorrectIndex(editingQuestion.correctIndex || 0);
      setPoints(editingQuestion.points || basePoints);
      setPassPts(editingQuestion.passPoints || passPoints);
      setCustomTime(editingQuestion.customTime || '');
      setExplanation(editingQuestion.explanation || '');
    } else {
      setText('');
      setCategory('');
      setOpt0('');
      setOpt1('');
      setOpt2('');
      setOpt3('');
      setCorrectIndex(0);
      setPoints(basePoints);
      setPassPts(passPoints);
      setCustomTime('');
      setExplanation('');
    }
  }, [editingQuestion, basePoints, passPoints]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text || !opt0 || !opt1 || !opt2 || !opt3) {
      alert('Please fill out the question and all 4 options!');
      return;
    }

    onSave({
      id: editingQuestion?.id || `q-${Date.now()}`,
      text,
      category,
      options: [opt0, opt1, opt2, opt3],
      correctIndex: parseInt(correctIndex, 10),
      points: parseInt(points, 10) || basePoints,
      passPoints: parseInt(passPts, 10) || passPoints,
      customTime: customTime ? parseInt(customTime, 10) : null,
      explanation
    });
    onClose();
  };

  return (
    <div className="modal-backdrop active">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{editingQuestion ? 'Edit Question' : 'Add New Question'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Question Text *</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter question text..."
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Category / Subject</label>
              <input
                type="text"
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. CPU Scheduling"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Custom Timer (sec)</label>
              <input
                type="number"
                className="form-input"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                placeholder="Default (25s)"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Options (A, B, C, D) *</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="text"
                className="form-input"
                value={opt0}
                onChange={(e) => setOpt0(e.target.value)}
                placeholder="Option A"
                required
              />
              <input
                type="text"
                className="form-input"
                value={opt1}
                onChange={(e) => setOpt1(e.target.value)}
                placeholder="Option B"
                required
              />
              <input
                type="text"
                className="form-input"
                value={opt2}
                onChange={(e) => setOpt2(e.target.value)}
                placeholder="Option C"
                required
              />
              <input
                type="text"
                className="form-input"
                value={opt3}
                onChange={(e) => setOpt3(e.target.value)}
                placeholder="Option D"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Correct Option *</label>
              <select
                className="form-select"
                value={correctIndex}
                onChange={(e) => setCorrectIndex(e.target.value)}
              >
                <option value="0">Option A</option>
                <option value="1">Option B</option>
                <option value="2">Option C</option>
                <option value="3">Option D</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Base Points</label>
              <input
                type="number"
                className="form-input"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Pass Points</label>
              <input
                type="number"
                className="form-input"
                value={passPts}
                onChange={(e) => setPassPts(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Explanation</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explanation shown after answer..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Question</button>
          </div>
        </form>
      </div>
    </div>
  );
}
