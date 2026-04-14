// supabase-config.js
const SUPABASE_URL = 'https://ajeeutzdtaddnqxktwgi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZWV1dHpkdGFkZG5xeGt0d2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTMwMzgsImV4cCI6MjA5MDM4OTAzOH0.edqU65LasrR-nXCgCYoRNJgpB3QZuU_ux70xXf-FBts';

// Используем уникальное имя, чтобы не ломать index.html
const supabaseShared = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function saveQuizResult(testName, finalScores) {
    try {
        const { data: { session } } = await supabaseShared.auth.getSession();

        if (!session) {
            console.log("Пользователь не авторизован.");
            return;
        }

        const keys = Object.keys(finalScores);
        const winner = keys.reduce((a, b) => finalScores[a] > finalScores[b] ? a : b);
        const percentage = Math.round((finalScores[winner] / 20) * 100);
        const scoreText = `${winner.charAt(0).toUpperCase() + winner.slice(1)}: ${percentage}%`;

        const { error } = await supabaseShared
            .from('test_results')
            .insert([{
                user_id: session.user.id,
                test_name: testName,
                score: scoreText
            }]);

        if (error) throw error;
        console.log(`Успешно сохранено: ${testName}`);
    } catch (err) {
        console.error("Ошибка сохранения:", err.message);
    }
}
