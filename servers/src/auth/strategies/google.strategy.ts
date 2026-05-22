import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    const callbackURL =
      configService.get<string>('GOOGLE_CALLBACK_URL')?.trim() ||
      'http://localhost:5000/api/auth/google-login/callback';

    super({
      clientID: configService.get('GOOGLE_CLIENT_ID')?.trim(),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET')?.trim(),
      callbackURL,
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'openid'
      ],
      userProfileURL: 'https://www.googleapis.com/oauth2/v2/userinfo',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { emails, displayName, photos, id, _json } = profile;
    const email = emails[0].value;
    
    // Lấy ảnh: Thử photos trước, sau đó thử _json.picture
    let avatar = photos?.[0]?.value || (_json as any)?.picture;
    
    if (avatar && avatar.includes('s96-c')) {
      avatar = avatar.replace('s96-c', 's400-c');
    }

    // TEST HARDCODE - Chỉ dành cho chẩn đoán cuối cùng
    if (email === 'dauminhtuan2203@gmail.com') {
      avatar = 'https://ui-avatars.com/api/?name=Admin+Tuan&background=0D8ABC&color=fff&size=512';
    }

    console.log('=== Google Profile Debug ===');
    console.log('Email:', email);
    console.log('Avatar URL:', avatar);
    console.log('DisplayName:', displayName);
    
    let user = await this.userService.findByEmail(email);
    
    const adminEmails = (this.configService.get('ADMIN_EMAILS') || '').split(',').map(e => e.trim()).filter(Boolean);
    const isAdminEmail = adminEmails.includes(email);
    
    const nameToSet = displayName || user?.name || email.split('@')[0] || 'Google User';
    
    if (!user) {
      console.log('Creating new Google user...');
      user = await this.userService.createSocial({
        email,
        name: nameToSet,
        role: isAdminEmail ? 'ADMIN' : 'CUSTOMER',
        avatar: avatar,
        provider: 'GOOGLE',
        providerId: id
      });
    } else {
      console.log('Syncing existing user with Google data...');
      user = await this.userService.update(user.id, { 
        name: user.name || nameToSet,
        avatar: avatar || user.avatar,
        provider: 'GOOGLE',
        providerId: id
      } as any);
    }

    console.log('Final User Sync State:', { id: user.id, email: user.email, name: user.name, avatar: user.avatar });
    return { userId: user.id, email: user.email, role: user.role };
  }
}






