// supabase-config.js
const SUPABASE_URL = 'https://ajeeutzdtaddnqxktwgi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZWV1dHpkdGFkZG5xeGt0d2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTMwMzgsImV4cCI6MjA5MDM4OTAzOH0.edqU65LasrR-nXCgCYoRNJgpB3QZuU_ux70xXf-FBts';

// Используем уникальное имя, чтобы не ломать index.html
const supabaseShared = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function saveQuizResult(testName, finalScores) {
    // МАЯЧОК 1: Проверяем, что функция вообще вызлвалась
    console.log("=== Функция сохранения запустилась! ===");
    console.log("Данные теста:", testName, finalScores);

    try {
        const { data: { session } } = await supabaseShared.auth.getSession();

        if (!session) {
            console.warn("ВНИМАНИЕ: Пользователь не залогинен. Сохранение отменено.");
            return;
        }

        const keys = Object.keys(finalScores);
        const winner = keys.reduce((a, b) => finalScores[a] > finalScores[b] ? a : b);
        const percentage = Math.round((finalScores[winner] / 20) * 100);
        const scoreText = `${winner.charAt(0).toUpperCase() + winner.slice(1)}: ${percentage}%`;

        // МАЯЧОК 2: Смотрим, что мы отправляем в базу
        console.log("Отправляю в базу:", { user_id: session.user.id, test_name: testName, score: scoreText });

        const { error } = await supabaseShared
            .from('test_results') // Убедись, что таблица называется именно так!
            .insert([{
                user_id: session.user.id,
                test_name: testName,
                score: scoreText
            }]);

        if (error) {
            // МАЯЧОК 3: Если база вернула ошибку
            console.error("ОШИБКА ОТ SUPABASE:", error.message);
            throw error;
        }

        console.log("✅ УСПЕХ: Результат сохранен в базе данных.");

    } catch (err) {
        console.error("❌ КРИТИЧЕСКАЯ ОШИБКА:", err.message);
    }
}
