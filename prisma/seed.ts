import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing records in reverse dependency order
  await prisma.notification.deleteMany();
  await prisma.postHashtag.deleteMany();
  await prisma.hashtag.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.media.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const alex = await prisma.user.create({
    data: {
      username: 'alex_r',
      email: 'alex@example.com',
      passwordHash: defaultPasswordHash,
      name: 'Alex Rivera',
      bio: 'Digital Craftsman & UI/UX Architect 🎨 | Building the future of interactive web applications @HyperScale 🚀 | #design #typescript',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      website: 'https://alexrivera.design',
      location: 'San Francisco, CA',
    },
  });

  const sarah = await prisma.user.create({
    data: {
      username: 'sarah_c',
      email: 'sarah@example.com',
      passwordHash: defaultPasswordHash,
      name: 'Sarah Chen',
      bio: 'National Geographic Explorer & Landscape Photographer 📷 | Chasing golden hour across 42 countries 🏔️✨ | #travel #nature',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      website: 'https://sarahchen.photos',
      location: 'Vancouver, Canada',
    },
  });

  const leo = await prisma.user.create({
    data: {
      username: 'leo_v',
      email: 'leo@example.com',
      passwordHash: defaultPasswordHash,
      name: 'Leo Vance',
      bio: '3D Motion Designer & Indie Filmmaker 🎬 | Unreal Engine 5 & Blender enthusiast | Let’s create wonder ⚡ #motion #art #3d',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      website: 'https://leovance.studio',
      location: 'Tokyo, Japan',
    },
  });

  const maya = await prisma.user.create({
    data: {
      username: 'maya_p',
      email: 'maya@example.com',
      passwordHash: defaultPasswordHash,
      name: 'Maya Patel',
      bio: 'AI Research Lead & Angel Investor 🤖💡 | Exploring autonomous systems and human-computer symbiosis | #ai #tech #future',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      website: 'https://mayapatel.ai',
      location: 'London, UK',
    },
  });

  // 2. Create Follow Relationships
  // Alex follows Sarah and Maya
  await prisma.follow.create({ data: { followerId: alex.id, followingId: sarah.id } });
  await prisma.follow.create({ data: { followerId: alex.id, followingId: maya.id } });

  // Sarah follows Alex and Leo
  await prisma.follow.create({ data: { followerId: sarah.id, followingId: alex.id } });
  await prisma.follow.create({ data: { followerId: sarah.id, followingId: leo.id } });

  // Leo follows Alex and Sarah
  await prisma.follow.create({ data: { followerId: leo.id, followingId: alex.id } });
  await prisma.follow.create({ data: { followerId: leo.id, followingId: sarah.id } });

  // Maya follows Alex, Sarah, and Leo
  await prisma.follow.create({ data: { followerId: maya.id, followingId: alex.id } });
  await prisma.follow.create({ data: { followerId: maya.id, followingId: sarah.id } });
  await prisma.follow.create({ data: { followerId: maya.id, followingId: leo.id } });

  // 3. Create Hashtags
  const tagNames = ['design', 'travel', 'nature', 'motion', 'art', '3d', 'ai', 'tech', 'future', 'coding', 'photography', 'vibes'];
  const hashtagMap: Record<string, string> = {};

  for (const name of tagNames) {
    const tag = await prisma.hashtag.create({ data: { name } });
    hashtagMap[name] = tag.id;
  }

  // Helper to link hashtags
  const linkTags = async (postId: string, tags: string[]) => {
    for (const t of tags) {
      if (hashtagMap[t]) {
        await prisma.postHashtag.create({
          data: { postId, hashtagId: hashtagMap[t] },
        });
      }
    }
  };

  // 4. Create Posts with Media
  // Post 1: Sarah's Swiss Alps Travel Carousel
  const post1 = await prisma.post.create({
    data: {
      authorId: sarah.id,
      caption: 'Woke up at 4:30 AM to catch the dawn light spilling over the Matterhorn. Nature never ceases to inspire pure awe. 🏔️✨ Which shot do you like best, 1 or 2? #travel #nature #photography @alex_r',
      createdAt: new Date(Date.now() - 1000 * 60 * 35), // 35 mins ago
      media: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
            type: 'IMAGE',
            aspectRatio: 1.5,
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
            type: 'IMAGE',
            aspectRatio: 1.5,
            order: 1,
          },
        ],
      },
    },
  });
  await linkTags(post1.id, ['travel', 'nature', 'photography']);

  // Post 2: Alex's UI Component System Design
  const post2 = await prisma.post.create({
    data: {
      authorId: alex.id,
      caption: 'Fresh iteration of the glassmorphic dark-mode component architecture. Smooth spring physics with framer-motion and zero layout shifts. 🎨💻 Thoughts on the glow radii? #design #coding #tech',
      createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      media: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
            type: 'IMAGE',
            aspectRatio: 1.33,
            order: 0,
          },
        ],
      },
    },
  });
  await linkTags(post2.id, ['design', 'coding', 'tech']);

  // Post 3: Leo's 3D Cyber Motion Video/Render
  const post3 = await prisma.post.create({
    data: {
      authorId: leo.id,
      caption: 'Cyberpunk neon alleyway sequence rendered in Unreal Engine 5 with full raytracing and volumetric mist. Soundtrack in the works! ⚡🌆 #motion #art #3d #vibes',
      createdAt: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
      media: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
            type: 'IMAGE',
            aspectRatio: 1.77,
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1000&q=80',
            type: 'IMAGE',
            aspectRatio: 1.77,
            order: 1,
          },
        ],
      },
    },
  });
  await linkTags(post3.id, ['motion', 'art', '3d', 'vibes']);

  // Post 4: Maya's Autonomous Agents Breakthrough
  const post4 = await prisma.post.create({
    data: {
      authorId: maya.id,
      caption: 'Just published our lab results on cooperative multi-agent consensus protocols. The emergent problem-solving behaviors are unbelievable! Read the preprint in my bio. 🧠🤖 #ai #tech #future @alex_r @sarah_c',
      createdAt: new Date(Date.now() - 1000 * 60 * 360), // 6 hours ago
      media: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1000&q=80',
            type: 'IMAGE',
            aspectRatio: 1.33,
            order: 0,
          },
        ],
      },
    },
  });
  await linkTags(post4.id, ['ai', 'tech', 'future']);

  // Post 5: Sarah's Kyoto Forest Morning
  const post5 = await prisma.post.create({
    data: {
      authorId: sarah.id,
      caption: 'Quiet rain in the Arashiyama bamboo grove. Listen to the wind through the leaves. 🎋🇯🇵 #travel #nature #vibes @leo_v',
      createdAt: new Date(Date.now() - 1000 * 60 * 1440), // 1 day ago
      media: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
            type: 'IMAGE',
            aspectRatio: 1.33,
            order: 0,
          },
        ],
      },
    },
  });
  await linkTags(post5.id, ['travel', 'nature', 'vibes']);

  // 5. Likes
  // Post 1 (Sarah) liked by Alex, Leo, Maya
  await prisma.like.create({ data: { userId: alex.id, postId: post1.id } });
  await prisma.like.create({ data: { userId: leo.id, postId: post1.id } });
  await prisma.like.create({ data: { userId: maya.id, postId: post1.id } });

  // Post 2 (Alex) liked by Sarah, Maya
  await prisma.like.create({ data: { userId: sarah.id, postId: post2.id } });
  await prisma.like.create({ data: { userId: maya.id, postId: post2.id } });

  // Post 3 (Leo) liked by Alex, Sarah
  await prisma.like.create({ data: { userId: alex.id, postId: post3.id } });
  await prisma.like.create({ data: { userId: sarah.id, postId: post3.id } });

  // Post 4 (Maya) liked by Alex, Leo
  await prisma.like.create({ data: { userId: alex.id, postId: post4.id } });
  await prisma.like.create({ data: { userId: leo.id, postId: post4.id } });

  // 6. Comments
  // Comments on Post 1
  const c1 = await prisma.comment.create({
    data: {
      postId: post1.id,
      userId: alex.id,
      content: 'The lighting in the second slide is absolutely ethereal! Did you use a graduated ND filter here? 🏔️',
    },
  });

  await prisma.comment.create({
    data: {
      postId: post1.id,
      userId: sarah.id,
      parentId: c1.id,
      content: 'Thanks Alex! Just a standard polarizer and bracketed exposure. Dawn was freezing cold but worth every second! ❄️',
    },
  });

  await prisma.comment.create({
    data: {
      postId: post1.id,
      userId: leo.id,
      content: 'Bookmarking this for environment references in my upcoming cinematic! Spectacular capture. 👏',
    },
  });

  // Comments on Post 2
  await prisma.comment.create({
    data: {
      postId: post2.id,
      userId: sarah.id,
      content: 'The smoothness of these UI components is breathtaking. Need this in production! 🔥',
    },
  });

  // Comments on Post 4
  await prisma.comment.create({
    data: {
      postId: post4.id,
      userId: alex.id,
      content: 'Incredible breakthrough Maya! Just sent the paper to our engineering group. 🚀',
    },
  });

  // 7. Notifications
  // Alex gets notified that Sarah liked his post and commented
  await prisma.notification.create({
    data: {
      recipientId: alex.id,
      actorId: sarah.id,
      type: 'LIKE',
      postId: post2.id,
      read: false,
    },
  });
  await prisma.notification.create({
    data: {
      recipientId: alex.id,
      actorId: sarah.id,
      type: 'COMMENT',
      postId: post2.id,
      read: false,
    },
  });
  // Alex gets notified that Maya mentioned him
  await prisma.notification.create({
    data: {
      recipientId: alex.id,
      actorId: maya.id,
      type: 'MENTION',
      postId: post4.id,
      read: false,
    },
  });
  // Alex gets notified that Leo followed him
  await prisma.notification.create({
    data: {
      recipientId: alex.id,
      actorId: leo.id,
      type: 'FOLLOW',
      read: true,
    },
  });

  console.log('✅ Seeding complete!');
  console.log(`Created 4 Users: alex_r, sarah_c, leo_v, maya_p (Password: password123)`);
  console.log(`Created 5 Posts with multimedia carousels, 12 Hashtags, Likes, and Comments.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
