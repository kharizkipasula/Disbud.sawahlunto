
import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Trophy, CheckCircle, AlertCircle, RefreshCw, Star, Award, ChevronRight } from 'lucide-react';

const quizData = [
  {
    id: '1',
    question: { en: 'In what year was coal first discovered in the Sawahlunto region?', id: 'Pada tahun berapakah batubara pertama kali ditemukan di wilayah Sawahlunto?' },
    options: [
      { en: '1858', id: '1858' },
      { en: '1868', id: '1868' },
      { en: '1878', id: '1878' },
      { en: '1888', id: '1888' }
    ],
    correctIndex: 1
  },
  {
    id: '2',
    question: { en: 'What is the name of the famous traditional weaving from Sawahlunto?', id: 'Apa nama kain tenun tradisional yang terkenal dari Sawahlunto?' },
    options: [
      { en: 'Batik Tanah Liat', id: 'Batik Tanah Liat' },
      { en: 'Songket Silungkang', id: 'Songket Silungkang' },
      { en: 'Tenun Ikat', id: 'Tenun Ikat' },
      { en: 'Ulos', id: 'Ulos' }
    ],
    correctIndex: 1
  },
  {
    id: '3',
    question: { en: 'What was the Goedang Ransoem building used for in the past?', id: 'Digunakan sebagai apakah gedung Goedang Ransoem pada masa lampau?' },
    options: [
      { en: 'Coal storage', id: 'Gudang Batubara' },
      { en: 'Mining office', id: 'Kantor Tambang' },
      { en: 'Public kitchen', id: 'Dapur Umum' },
      { en: 'Railway station', id: 'Stasiun Kereta' }
    ],
    correctIndex: 2
  }
];

const HeritageQuiz: React.FC = () => {
  const { language } = useData();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === quizData[currentStep].correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentStep < quizData.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <section id="quiz" className="py-24 bg-heritage-stone relative overflow-hidden scroll-mt-20">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-heritage-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-heritage-brick/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-heritage-dark text-white px-4 py-2 rounded-full mb-4 shadow-lg">
                <Trophy className="w-4 h-4 text-heritage-gold" />
                <span className="text-xs font-bold uppercase tracking-widest">Culture Quest</span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-heritage-dark mb-4">
              {language === 'en' ? 'Heritage Guardian Challenge' : 'Tantangan Penjaga Warisan'}
            </h2>
            <p className="text-gray-500">
              {language === 'en' ? 'Test your knowledge about the UNESCO City of Sawahlunto!' : 'Uji pengetahuanmu tentang Kota UNESCO Sawahlunto!'}
            </p>
          </div>

          {!showResult ? (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              {/* Progress Bar */}
              <div className="h-2 bg-gray-100 w-full">
                <div 
                  className="h-full bg-heritage-gold transition-all duration-500" 
                  style={{ width: `${((currentStep + 1) / quizData.length) * 100}%` }}
                ></div>
              </div>

              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {language === 'en' ? 'Question' : 'Pertanyaan'} {currentStep + 1} / {quizData.length}
                    </span>
                    <div className="flex gap-1">
                        {[...Array(quizData.length)].map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i <= currentStep ? 'bg-heritage-gold' : 'bg-gray-200'}`}></div>
                        ))}
                    </div>
                </div>

                <h3 className="text-xl md:text-2xl font-serif font-bold text-heritage-dark mb-10 leading-relaxed">
                  {quizData[currentStep].question[language]}
                </h3>

                <div className="space-y-4">
                  {quizData[currentStep].options.map((option, idx) => {
                    const isCorrect = idx === quizData[currentStep].correctIndex;
                    const isSelected = idx === selectedOption;
                    
                    let bgClass = "bg-gray-50 border-gray-100 hover:border-heritage-gold hover:bg-heritage-gold/5";
                    if (isAnswered) {
                      if (isCorrect) bgClass = "bg-green-50 border-green-500 text-green-700";
                      else if (isSelected) bgClass = "bg-red-50 border-red-500 text-red-700";
                      else bgClass = "bg-gray-50 border-gray-100 opacity-50";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        disabled={isAnswered}
                        className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex justify-between items-center group ${bgClass}`}
                      >
                        <span className="font-bold">{option[language]}</span>
                        {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {isAnswered && isSelected && !isCorrect && <AlertCircle className="w-5 h-5 text-red-500" />}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="mt-10 animate-fade-in">
                    <button
                      onClick={nextQuestion}
                      className="w-full bg-heritage-dark text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-heritage-gold transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <span>{currentStep === quizData.length - 1 ? (language === 'en' ? 'Finish' : 'Selesai') : (language === 'en' ? 'Next Question' : 'Pertanyaan Berikutnya')}</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-4 border-heritage-gold/20 animate-scale-in">
              <div className="w-24 h-24 bg-heritage-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Award className="w-12 h-12 text-heritage-gold" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-heritage-dark mb-4">
                {language === 'en' ? 'Your Result' : 'Hasil Akhir'}
              </h3>
              <div className="text-6xl font-display font-black text-heritage-gold mb-6">
                {score} / {quizData.length}
              </div>
              <p className="text-gray-600 mb-10 max-w-sm mx-auto">
                {score === quizData.length 
                  ? (language === 'en' ? 'Amazing! You are a true Guardian of Sawahlunto Heritage.' : 'Luar biasa! Kamu adalah Penjaga Warisan Sawahlunto sejati.')
                  : (language === 'en' ? 'Great effort! Keep exploring to learn more about our history.' : 'Usaha yang bagus! Teruslah menjelajah untuk belajar lebih banyak.')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetQuiz}
                  className="flex items-center justify-center gap-2 bg-heritage-dark text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-heritage-gold transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  {language === 'en' ? 'Try Again' : 'Coba Lagi'}
                </button>
                <button
                   onClick={() => document.getElementById('hero')?.scrollIntoView({behavior: 'smooth'})}
                   className="flex items-center justify-center gap-2 border-2 border-heritage-dark text-heritage-dark px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-heritage-dark hover:text-white transition-all"
                >
                    {language === 'en' ? 'Share Score' : 'Bagikan Skor'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default HeritageQuiz;
