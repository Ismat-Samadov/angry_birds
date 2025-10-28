import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email və parol tələb olunur' },
        { status: 400 }
      );
    }

    // Find user by email
    const result = await query(
      'SELECT * FROM demo_bank.users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Email və ya parol səhvdir' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Email və ya parol səhvdir' },
        { status: 401 }
      );
    }

    // Update last login
    await query(
      'UPDATE demo_bank.users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1',
      [user.user_id]
    );

    // Create JWT token
    const token = await createToken({
      user_id: user.user_id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      department: user.department
    });

    // Return user data and token
    const response = NextResponse.json({
      success: true,
      user: {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        department: user.department
      },
      token
    });

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: true, // Always secure for production
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Giriş zamanı xəta baş verdi' },
      { status: 500 }
    );
  }
}
