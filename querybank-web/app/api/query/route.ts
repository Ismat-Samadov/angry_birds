import { NextRequest, NextResponse } from 'next/server';
import { generateQuery } from '@/lib/gemini';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: 'Sual tələb olunur' },
        { status: 400 }
      );
    }

    // Generate SQL query using AI
    const queryInfo = await generateQuery(question);

    // Execute the query
    const result = await query(queryInfo.query);

    return NextResponse.json({
      success: true,
      data: result.rows,
      queryInfo: {
        query: queryInfo.query,
        explanation: queryInfo.explanation,
        needs_chart: queryInfo.needs_chart,
        chart_type: queryInfo.chart_type,
        chart_config: queryInfo.chart_config,
      },
    });
  } catch (error: any) {
    console.error('Query error:', error);
    return NextResponse.json(
      { error: error.message || 'Sorğu zamanı xəta baş verdi' },
      { status: 500 }
    );
  }
}
